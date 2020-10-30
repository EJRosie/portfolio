import React, { Component } from "react";
import styled from "styled-components";
import { KeyboardAvoidingView, Animated } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {
  Container,
  Text,
  Input,
  Item,
  Button,
  View,
  Spinner
} from "native-base";
import Header from "../common/header";
import { Auth } from "aws-amplify";
import { Authenticator, SignIn } from "aws-amplify-react-native";
import awsconfig from "../../aws-exports";
import * as Mutations from "../../graphql-custom/users/mutations";
import Query, { registerForPushNotificationsAsync } from "../../api";
import Expo, { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import ClaimUsername from "./claim-username";
import { COLORS } from "../../../native-base-theme/variables/material";
import { TouchableOpacity, AsyncStorage, Linking, TouchableWithoutFeedback, Modal } from "react-native";
import Constants from 'expo-constants';
import * as Animatable from 'react-native-animatable';
import AuthInputs from './auth-inputs';
/*
* You can this.props.onStateChange('signIn') to change to sign in form.
*     const { authState } = this.props;
    if (authState !== 'signUp') { return null; }
*/
export default class App extends React.Component {
  state = {
    signUp: null,
    username: "",
    email: "",
    password: "",
    error: "",
    claimUser: this.props.needUsername,
    enablePn: false,
    waiting: false,
    identityId: "",

    bounceValue: new Animated.Value(100),
    buttonText: "Show Subview"
  };
  componentDidMount() {
    this.setState({
      waiting: this.props.waiting,
    })
  }
  _slide = (authState=null) => {
    this.setState({signUp: authState});
  }

  render() {
    if (this.state.claimUser || this.state.enablePn || this.props.needUsername) {
      return (
          <ClaimUsername
            {...this.props}
          enablePn={this.state.enablePn}
          identityId={this.state.identityId}
          email={
            this.state.email ||
            this.props.needUsername.username.replace("#", "@")
          }
          user={this.state.claimUser || this.props.needUsername}
        />
      );
    }
    return (
      <Authentication>

        <TopView>
          <Title>boop</Title>
          <Tagline>Ask your friends to play games now.</Tagline>
          <Tagline>Or later.</Tagline>
        </TopView>

        <ButtonChoice>
          <AuthButton light bordered rounded large left onPress={() => this._slide(false)}>
            <Text>Login</Text>
          </AuthButton>
          <AuthButton light large rounded right onPress={() => this._slide(true)}>
            <Text style={{color: COLORS.PRIMARY}}>Sign Up</Text>
          </AuthButton>
        </ButtonChoice>
        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.signUp !== null}
        onRequestClose={() => this.setState({signUp: null})}
        >
        <CloseModalOverlay onPressOut={() => this.setState({signUp: null})}>
          <ModalContainer>
          <MenuContainer behavior="padding">
            <AuthInputs
              switchAuthStates={() => this.setState({ username: "", email: "", password: "", error: "", signUp: !this.state.signUp })}
              signIn={() => this.signIn()}
              signUp={() => this.signUp()}
              state={this.state}
              onChange={(name, change) => this.setState({[name]: change})}
            />
          </MenuContainer>
          </ModalContainer>
        </CloseModalOverlay>
        </Modal>

      </Authentication>
    );
  }


  /* Sign up for an account */
  signUp() {
    this.setState({ waiting: true });
    const { email, password } = this.state;
    const emailValid = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" );
    if (!emailValid.test(email)) { return this.onError("Invalid Email format detected."); }

    var username = email.replace("@", "#");
    Auth.signUp({ username, password})
    .then(async res => {  this.onSuccess(username, password);})
    .catch(err => this.onError(err));
  }
  /* Sign in to an already existing account */
  signIn() {
    console.log("sign in");
    this.setState({ waiting: true });
    const { email, password } = this.state;
    var username = email.replace("@", "#");
    this.onSuccess(username, password, true);
  }

  onSuccess = async (email, password, exists = false) => {
    if (!!email && !!password)
      Auth.signIn(email, password)
      .then(async user => {
        const credentials = await Auth.currentCredentials();
        await AsyncStorage.setItem('identityId', credentials._identityId)
        this.setState({ identityId: credentials._identityId });
        this.RegisterPNs(
          user.signInUserSession.accessToken.payload.device_key,
          user.attributes.sub,
          exists,
          user,
          email
        );
      })
      .catch(err => {this.onError(err); console.log("ERRRRR ", err);});
    else { this.onError("Missing credentials"); }
  
  }

  RegisterPNs = async (deviceToken, userId, exists, user, email) => {
    let ostype = Constants.platform.ios ? "ios" : "android"
    if(ostype == "ios") {
      Query(Mutations.createUserDevice, {
        input: { deviceKey: deviceToken, userDeviceUserId: user.attributes.sub, isActive: 1}
      })
      .then(res => {
        this.props.getDeviceDetails(res);
        this.setState({ claimUser: user, enablePn: exists});
      })
      .catch(error => { console.log("Create iOS User Error: ", error); this.props.onLogIn(user);});
    }
    else {
      registerForPushNotificationsAsync(ostype).then(PNres => {
        Query(Mutations.createUserDevice, {
          input: { deviceKey: deviceToken, expoPushToken: PNres, userDeviceUserId: user.attributes.sub }
        })
        .then(res => {
          this.props.getDeviceDetails(res);
          if (exists) { return this.props.onLogIn(user); }
          this.setState({ claimUser: user });
        });
      }).catch(error => { console.log("Create Android User Error: ", error); this.props.onLogIn(user);});
    }
  };

  onError(err) {
    console.log("Auth Error: ", err);
    let message = err.message || err;
    if (message.startsWith("Invalid Email format")) {
      message = "Invalid email";
    }
    if (message.startsWith("User Already Exists")) {
      message = "Email already taken";
    }
    if (message.startsWith("1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6")) {
      message = "Password must be at least 6 characters"
    }
    this.setState({ email: "", username: "", password: "", error: message, waiting: false });
  }

}


var hiddenView = {
  flex: 1,
  position: 'absolute',
  bottom: 0,

}
const Disclaimer = styled.Text`
  text-align: center;
`;
const TopView = styled.View`
  width: 100%;
  align-items: center;
  margin-top: ${hp("25%")};
  color: ${COLORS.WHITE};
`;
const Title = styled.Text`
  font-size: 64px;
  font-weight: bold;
  font-family: fredoka;
  width: 75%;
  text-align: center;
  margin-bottom: 50px;
  color: ${COLORS.WHITE};
`;
const Tagline = styled.Text`
  font-size: 18px;
  width: 80%;
  font-family: gotham;
  font-weight: 600;
  text-align: center;
  color: ${COLORS.WHITE};
`;
const Authentication = styled(Container) `
  background-color: ${COLORS.PRIMARY};
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
  flex: 1;
`;

const SwitchState = styled.Text`
  color: ${COLORS.BLUE};
  text-decoration-line: underline;
`;
const SignUpButton = styled(Button) `
  flex: 1;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-top: 10px;
`;
const ButtonText = styled.Text`
  color: ${COLORS.TRUE_WHITE};
  text-align: center;
  font-weight: bold;
  font-size: ${wp("4%")};
`;
const ButtonView = styled.View`
  flex-direction: row;
`;
const ErrorMessage = styled.Text`
  color: red;
`;
const BottomView = styled.KeyboardAvoidingView`
  padding-horizontal: 20px;
  justify-content: flex-start;
  align-items: stretch;
  width: ${wp("100%")};
  background: white;
`;
const ButtonChoice = styled.View`
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: row;
  margin-bottom: 20px;
`;
const AuthButton = styled(Button)`
  width: ${wp("50%") - 35};
  justify-content: center;
  align-items: center;
  ${props => props.left ? "margin-right: 5px;" : "margin-left: 5px;"}
`;
const SwitchButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const TextField = styled.TextInput`
  height: 50px;
  padding: 10px;
  font-size: 16px;
  background: ${COLORS.TRUE_WHITE};
  border-color: ${COLORS.BLUE};
  border-width: 1px;
  border-radius: 10px;
  margin-bottom: 10px;
`;


const ModalContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
`;
const MenuContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  box-shadow: 0px -3px 20px rgba(0, 0, 0, 0.08);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding-top: 10px;
  padding-bottom: 20px;
  background-color: ${COLORS.WHITE};
`;
const CloseModalOverlay = styled(TouchableWithoutFeedback) `
`;