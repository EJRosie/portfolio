import React, { Component } from "react";
import styled from "styled-components";
import { Keyboard, KeyboardAvoidingView, Animated } from "react-native";
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

/*
* You can this.props.onStateChange('signIn') to change to sign in form.
*     const { authState } = this.props;
    if (authState !== 'signUp') { return null; }
*/
export default class App extends React.Component {
  state = {
    keyboardState: 'closed'
  }
  
  secondInput;

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({
      keyboardState: 'opened'
    });
  }

  _keyboardDidHide = () => {
    this.setState({
      keyboardState: 'closed'
    });
  }

  render() {
    const {state} = this.props;
    return (
      <BottomView>
          <FieldTitle>Email</FieldTitle>
          <TextField
            placeholder={`Email ${!state.signUp ? "or Username" : ""}`}
            onChangeText={text => this.props.onChange('email', text)}
            autoCompleteType={"email"}
            returnKeyType={"next"}
            blurOnSubmit={false}
            onSubmitEditing={() => { this.secondInput.focus() }}
            keyboardType={"email-address"}
            textContentType={"emailAddress"}
          />
          <FieldTitle>Password</FieldTitle>
          <TextField
            ref={component => this.secondInput = component} 
            secureTextEntry={true}
            returnKeyType={"done"}
            placeholder="Password"
            onChangeText={text => this.props.onChange('password', text)}
            onSubmitEditing={() => { if (state.signUp) { return this.props.signUp() } return this.props.signIn() }}
            autoCompleteType={"password"}
            textContentType={"password"}
          />
        <ErrorMessage>{state.error}</ErrorMessage>
        <ButtonView>
          <SignUpButton primary rounded large bordered disabled={state.password.length < 1 || state.email.length < 1} onPress={() => { if (state.signUp) { return this.props.signUp() } return this.props.signIn() }}>
            {state.waiting ? (
              <Spinner color={COLORS.PRIMARY} />
            ) : (
                <Text>
                  {state.signUp ? `Sign Up` : `Let's Go`}
                </Text>
              )}
          </SignUpButton>
        </ButtonView>
        <SwitchButton
          onPress={() => this.props.switchAuthStates()}
        >
          <SwitchState>
            {state.signUp ? `Already have an account?` : `Don't have an account yet?`}
          </SwitchState>
        </SwitchButton>
        {state.signUp && this.state.keyboardState === 'closed' && (
          <Disclaimer>
            By signing up, you agree to our <Link onPress={() => Linking.openURL("https://boop.gg/privacy-policy")}>Privacy Policy</Link> and <Link onPress={() => Linking.openURL("https://boop.gg/terms-of-service")}>Terms of
          Service</Link>
          </Disclaimer>
        )}
        {state.signUp && this.state.keyboardState === 'opened' && (
          <DisclaimerNoMarginBottom>
            By signing up, you agree to our <Link onPress={() => Linking.openURL("https://boop.gg/privacy-policy")}>Privacy Policy</Link> and <Link onPress={() => Linking.openURL("https://boop.gg/terms-of-service")}>Terms of
          Service</Link>
          </DisclaimerNoMarginBottom>
        )}
      </BottomView>
    );
  }

}

const Disclaimer = styled.Text`
  text-align: center;
  margin-bottom: 100px;
  color: ${COLORS.GREY};
  font-size: 12px;
`;
const DisclaimerNoMarginBottom = styled.Text`
  text-align: center;
  margin-bottom: 5px;
  color: ${COLORS.GREY};
  font-size: 12px;
`;
const Link = styled(Disclaimer)`
  color: ${COLORS.PRIMARY};
  text-decoration-line: underline;
`;
const SwitchState = styled.Text`
  font-family: gotham;
  font-size: 16px;
  color: ${COLORS.PRIMARY};
  text-decoration-line: underline;
`;
const SignUpButton = styled(Button) `
  flex: 1;
  justify-content: center;
  align-items: center;
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
const BottomView = styled.View`
  padding: 20px;
  justify-content: flex-start;
  align-items: stretch;
  width: ${wp("100%")};
`;
const SwitchButton = styled.TouchableOpacity`
  align-self: center;
  margin-top: 20px;
  margin-bottom: 30px;
`;
const FieldTitle = styled.Text`
  color: ${COLORS.PRIMARY};
  font-weight: bold;
  font-family: montserrat-bold;
`;
const TextField = styled.TextInput`
  height: 50px;
  font-size: 16px;
  background: ${COLORS.TRUE_WHITE};
  border-color: ${COLORS.GREY};
  border-bottom-width: 1px;
  margin-bottom: 10px;
`;