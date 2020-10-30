import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';

import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  Container, Text, Input, Item, Button, Content, View, Icon, Spinner, Toast,
  Root
} from 'native-base';
import moment from 'moment-timezone';
import Header from '../common/header';
import { Auth, Storage } from 'aws-amplify';
import { Authenticator, SignIn } from 'aws-amplify-react-native';
import awsconfig from '../../aws-exports';
import * as Mutations from '../../graphql-custom/users/mutations';
import Query, { registerForPushNotificationsAsync } from '../../api';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { COLORS } from '../../../native-base-theme/variables/material';
var uuid = require('react-native-uuid');
import { setUserProfilePicture } from '../../actions/user';
import { connect } from 'react-redux';
import * as FileSystem from 'expo-file-system';

class App extends React.Component {
  state = {
    username: "",
    error: '',
    image: null,
    waiting: false,
    enablePn: !!this.props.enablePn
  }
  // componentDidMount() {
  //    this.getPermissionAsync();
  // }

  render() {

    let { image } = this.state;
    return (
      <Root>
        <Container>
          <Header
            title={this.state.enablePn == false ? "Set a pic and username" : "Help us make Boop work for you"}
          />
          <StyledContent>
            {!this.state.enablePn &&
              <ImageButtonContainer>
                <Image source={image ? { uri: image } : require('../../../assets/images/Avatar.png')} style={{ width: 120, height: 120, borderRadius: 60 }} />
                <HalfCircle>
                  <ImageButton onPress={this._pickImage}><Icon name="camera" /></ImageButton>
                </HalfCircle>
              </ImageButtonContainer>
            }

            <Text>{this.state.enablePn == false ? "" :
              "Enable push notifications so that you never miss a Boop to play games, and to be alerted when friends respond to your Boops."}</Text>
            <ClaimUsernameContainer>
              {!this.state.enablePn &&
                <InputItem regular>
                  <Input placeholder='Choose Username' onChangeText={(text) => this.setState({ username: text })} />
                </InputItem>
              }
              <ErrorMessage>{this.state.error}</ErrorMessage>
              {this.state.enablePn == false ?
                <ButtonView><SignUpButton disabled={!this.canClaim()} info={this.canClaim()} onPress={() => this.saveChanges(this.props.user)}>{this.state.waiting ? <Spinner color='white' /> : <ButtonText> Claim Username </ButtonText>}</SignUpButton></ButtonView>
                :
                <ButtonView><SignUpButton info onPress={() => this.goToLoginScreen(this.props.user)}><ButtonText> Allow Push Notifications </ButtonText></SignUpButton></ButtonView>

              }
            </ClaimUsernameContainer>
          </StyledContent>
        </Container>
      </Root>
    );
  }

  canClaim() {
    const username = this.state.username;
    if(username.trim().length < 1) {return false;}
    return true;
  }

  getPermissionAsync = async () => {


    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.cancelled) {



      FileSystem.getInfoAsync(result.uri).then(uri => {
        try {

          const type = uri.uri.substr(uri.uri.lastIndexOf(".") + 1).toLowerCase();

          if (type == "jpg" || type == "jpeg" || type == "png") {
            if ((uri.size / 1048576).toFixed(3) < 5) {
              this.setState({ image: result.uri });
              // this.props.setUserImage(result.uri);
            }

            else {
              Toast.show({
                text: `Image too large. Maximum size is 5mb`,
                buttonText: ''
              })

            }
          }
          else {
            Toast.show({
              text: `image type is invalid`,
              buttonText: ''
            })

          }
        }
        catch (er) {
          console.log("Image Picker Error: ", er)
        }


      })

    }
  }

  _pickImage = async () => {

    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        alert("Sorry, we need camera roll permissions to make this work!");
      }
      else {
        this.getPermissionAsync();
      }
    }
    else {
      this.getPermissionAsync();
    }
  };

  async goToLoginScreen(user) {
    if (!Constants.platform.ios) {
      return this.props.onLogIn(user)
    }
    const deviceToken = user.signInUserSession.accessToken.payload.device_key;
    registerForPushNotificationsAsync('ios').then(res => {
      Query(Mutations.createUserDevice, {
        input: { deviceKey: deviceToken, expoPushToken: res, userDeviceUserId: user.attributes.sub }
      }).then(updateDeviceRes => this.props.onLogIn(user) )})
      .catch(ish => {console.log("PN Update Ish :", ish); this.props.onLogIn(user)});
  }

  async saveChanges(user) {
    try {
      this.setState({ waiting: true, error: "" });
      const { username, image } = this.state;
      if (!username || username.length < 1) {
        return this.setState({ waiting: false,error: "Please enter a username" });
      }
      if(username != username.trim()) {
        return this.setState({ waiting: false,error: "Please delete any trailing spaces"});
      }
      if(!(/^[a-z0-9]+$/i.test(username))) {
        return this.setState({ waiting: false,error: "No symbols are allowed."});
      }
      if (!image) {
        return this.changeName(user, null);
      }
      const imageName = image.slice(image.lastIndexOf("/") + 1);
      const randomID = uuid.v1();
      const response = await fetch(image);
      const fileObject = await response.blob();
      Storage.put(`images/profile/${randomID}/${imageName}`, fileObject, { level: 'public', contentType: `image/${imageName.slice(imageName.lastIndexOf('.') + 1)}` })
        .then(result => {
          Query(Mutations.createUserProfilePicture, { input: { fullsize: { key: result.key }, bucket: `${awsconfig.aws_user_files_s3_bucket}` } }).
            then((picRes) => this.changeName(user, picRes.data.createImage.id))
        })
        .catch(err => {
          this.changeName(user, null)
        }
        );
    }
    catch (e) {
      this.changeName(user, null);
    }


  }

  changeName = async (user, image) => {
    try {
      // const value = this.props.identityId;
      const value = await AsyncStorage.getItem('identityId');
      const { username } = this.state;
      //const { email } = this.props;
      const email = "WE_NEED_TO_FIX_AUTH@FIX.FIX";
      Auth.updateUserAttributes(user, { preferred_username: username, email }).then((res) => {
        const timezone = moment.tz.guess();
        const input = {  cognitoIdentifyId: value, cognitoUsername: user.username, preferredUsername: username, email, timezone };
        Query(Mutations.createUser, { input }).
          then((res) => {
            Query(Mutations.updateUserProfilePicture, { input: { userProfilePictureId: image, id: res.data.createUser.id } }).
              then((res) => {
                if (Constants.platform.ios) {
                  return this.setState({ enablePn: true })
                 }
                this.props.onLogIn(user)
              })

              .catch((err) => {
                if (Constants.platform.ios) {
                  this.setState({ enablePn: true })
                }
                else
                  this.props.onLogIn(user)
              }
              )
            })
          .catch((error) => this.onError(error));
      }).catch((err) => this.onError(err));
    }
    catch (error) {
      this.onError(error)
    }
  }
  onError(err) {
    console.log("Claim Error: ", err);
    let message = err.message || err;
    if (message.startsWith('Invalid phone number')) {
      // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
      message = 'Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.'
    }
    if(message.startsWith('Already found an entry for the provided username.')) {
      message = "Username already taken";
    }
    this.setState({ error: message, waiting: false });
  }
}

const mapStateToProps = (state) => ({
  userDetails: state.user
});

const mapDispatchToProps = ({
  setUserProfilePicture,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

const ClaimUsernameContainer = styled.View`
  margin-top: 20px;
`;
const StyledContent = styled(Content) `
  padding: 20px;
`;
const HalfCircle = styled.View`
  height: 60px;
  width: 120px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
`;
const ImageButton = styled(Button) `
  width: 120px;
  height: 120px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  justify-content: center;
  padding-bottom: 15px;
  align-items: flex-end;
  background-color: 'rgba(0, 0, 0, 0.3)'
`;
const ImageButtonContainer = styled.View`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  align-self: center;
  margin-bottom: 20px;
`;
const SignUpButton = styled(Button) `
  flex: 1;
  border-radius: 10px;
  text-align: center;
  align-items: center;
  justify-content: center;
`;
const ButtonText = styled.Text`
  color: ${COLORS.TRUE_WHITE};
  text-align: center;
  font-weight: bold;
  font-size: ${wp('4%')};
`;
const ButtonView = styled.View`
  flex-direction: row;
`;
const InputItem = styled(Item) `
  border-color: ${COLORS.LIGHT_GREY};
  background-color: ${COLORS.TRUE_WHITE};
  margin-bottom: 10px;
  border-width: 4px;
  border-radius: 10px;
`;
const ErrorMessage = styled.Text`
  color: red;
`;