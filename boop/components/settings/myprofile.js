import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  Switch,
  Linking,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import styled from "styled-components";
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
  Content,
  View,
  Icon,
  Spinner,
  Toast,
  Root,
  Drawer
} from "native-base";
import Header from "../common/header";
import { Auth, Storage } from "aws-amplify";
import { Authenticator, SignIn } from "aws-amplify-react-native";
import awsconfig from "../../aws-exports";
import * as Mutations from "../../graphql-custom/users/mutations";
import Query from "../../api";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import UserSections from "./myprofile-section";
import NotificationSettings from "./notification-setting";
import * as Permissions from "expo-permissions";
import { COLORS } from "../../../native-base-theme/variables/material";
var uuid = require("react-native-uuid");
import {
  createBottomTabNavigator,
  createAppContainer,
  createSwitchNavigator,
  NavigationActions
} from "react-navigation";
import { ScrubUser, setUserProfilePicture, setUserPreferredUsername } from "../../actions/user";
import * as UserQueries from "../../graphql-custom/users/queries";
import { AsyncStorage } from 'react-native';
import Expo from "expo";
import moment from 'moment-timezone';
import * as FileSystem from 'expo-file-system';
import ChangeCredentials from './change-credentials';
import SendFeedBack from "./send-feedback";
import CachedImage from "../cached-image";
import { StackActions } from 'react-navigation';
import { TouchableOpacity } from "react-native-gesture-handler";
// import {Localization} from 'expo';
// import DeviceInfo from 'react-native-device-info';


class App extends React.Component {
  state = {
    username: "",
    error: "",
    image: null,
    waiting: false,
    isEdit: false,
    switchValue: true,
    userId: "",
    timezone: "",
    modalVisible: false,
    notificationSettings: null,
    isOpenDrawer: false,
    drawer: "",
  };

  _handleToggleSwitch = () =>
    this.setState(state => ({
      switchValue: !state.switchValue
    }));


  componentDidMount() {
    //  this.getPermissionAsync();
    
    var zone_name = moment.tz.guess();
    var timezone = moment.tz(zone_name);
    var timezoneDisplay = moment.tz(zone_name).zoneAbbr();
    var offsetInHours = new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
    this.setState({
      timezone,
      timezoneDisplay,
      username: this.props.user.user.preferredUsername,
      image: this.props.user.user.profilePicture,
    });
    Query(UserQueries.getMyUserProfile).then(res => {
      this.setState({
        username: res.data.getMyUser.preferredUsername,
        userId: res.data.getMyUser.id,
        email: res.data.getMyUser.email
      });

      const notificationSettings = JSON.parse(
        res.data.getMyUser.notificationSettings
      );
      this.setState(() => ({
        notificationSettings: {
          friendRequestReceived: true,
          friendRequestConfirmed: true,
          boopReceived: true,
          boopRemainder: true,
          boopResponded: true,
          boopStart: true,
          boopNewComment: true,
          ...notificationSettings,
        }
      }));

      // if (res.data.getMyUser.profilePicture != null) {
      //   if (res.data.getMyUser.profilePicture.thumbLarge != null) {
      //     Storage.get(res.data.getMyUser.profilePicture.thumbLarge.key, {
      //       level: "public"
      //     }).then(res => this.setState({ image: res }));
      //   }
      //   else
      //     Storage.get(res.data.getMyUser.profilePicture.fullsize.key, {
      //       level: "public"
      //     }).then(res => this.setState({ image: res }));
      // }
    });

  }

  closeDrawer() { 
    this.setState({isOpenDrawer: false})
    Keyboard.dismiss();
    this._drawer._root.close()
   };

   openDrawer(drawer) { 
    this.setState({isOpenDrawer: true, drawer })
     this._drawer._root.open()
   };

  signOut = async () => {
    try {
      const value = await AsyncStorage.getItem('deviceKey');
      if (value !== null) {
        Query(Mutations.deleteUserDevice, {
          input: { deviceKey: value, userDeviceUserId: this.state.userId }
        })
        .then(res => {
          Auth.signOut();
          this.props.scrubUser();
        })
        .catch(error => {
          console.log("Delete User Error: ", error); 
          Auth.signOut();
          this.props.scrubUser();
        });
      } else {
        Auth.signOut();
        this.props.scrubUser();
      }

    } catch (error) {
      Auth.signOut();
      this.props.scrubUser();
    }
  };

  goBack = () => {
    const popAction = StackActions.pop({n: 1});
    this.props.navigation.dispatch(popAction);
    // if(this.props.navigation.getParam('from', 'some default value')=="your boops")
    // this.props.navigation.navigate("Your Boops")
    // else if(this.props.navigation.getParam('from', 'some default value')=="friends")
    // this.props.navigation.navigate("Friends")
    // else if(this.props.navigation.getParam('from', 'some default value')=="new")
    // this.props.navigation.navigate("New Boop")
    // else
    // this.props.navigation.navigate("Your Boops")
  }

  editName=()=>{
    // this.name_input._root.focus();
    this.setState({ isEdit: true, modalVisible: true,})
  }

  render() {
    let { image } = this.state;

    return (
      <Root>
        <Drawer 
        ref={(ref) => { this._drawer = ref; }} 
        content={
          
          this.state.isOpenDrawer && this.state.drawer === 'feedback' ?
          <SendFeedBack
            user={this.props.user}
            onBackButton={this.closeDrawer.bind(this)} 
          /> 
          : this.state.isOpenDrawer && this.state.drawer === 'credentials' ?
          <ChangeCredentials
            user={this.props.user}
            onBackButton={this.closeDrawer.bind(this)} 
          />
          :
          <></>
       }
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0}
        panCloseMask={0}
        side={'right'}
        tapToClose={false}
      >
        <Container>
          <Header
            leftButton={
              <HeaderButton
                onPress={() => 
                  this.goBack()
                }
              >
                <Icon style={{ color: COLORS.WHITE }} name="arrow-back" />
              </HeaderButton>
            }
            title={"Menu"}
          />
          <Content>
            <StyledContent>
              <EditImge>
                <ImageButtonContainer>
                  <CachedImage
                    s3Image={image}
                    preview={require("../../../assets/images/Avatar.png")}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                  <HalfCircle>
                    <ImageButton onPress={this._pickImage}>
                      <Icon name="camera" />
                    </ImageButton>
                  </HalfCircle>
                </ImageButtonContainer>
              </EditImge>
              {
                this.state.isEdit ?
                <>
                  <UsernameEdit>
                  <InputItem>
                  <Input
                    ref={(ref) => { this.name_input = ref; }}
                    placeholder="Prefered Username"
                    onChangeText={text => this.setState({ username: text })}
                    value={this.state.username}
                    autoFocus={true}
                    returnKeyType={'done'}
                    style={{ fontFamily: 'montserrat', fontSize: 16, color: 'rgba(0, 0, 0, 0.6)' }}
                  />
                  <TouchableOpacity onPress={() => this.updateUserName()} style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={{ color: '#66E29F', fontFamily: 'montserrat', fontSize: 14 }}>Update</Text>
                  </TouchableOpacity>
                </InputItem>
                
                </UsernameEdit>
              </>
              :
              <View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>
                <UserNameText>
                  <Text style={{fontFamily: 'montserrat-semibold', fontSize: 16, color: 'rgba(0, 0, 0, 0.6)'}}>{this.state.username}</Text>
                </UserNameText>
                <EditIcon>
                  <Icon
                    style={{ color: 'rgba(0, 0, 0, 0.6)' }}
                    type="FontAwesome5"
                    name="pencil-alt"
                    onPress={() =>
                      this.editName()
                    }
                  />
                </EditIcon>
              </View>
              }
              <ErrorMsg>{this.state.error}</ErrorMsg>
              {/* <SectionTitle>Linked Accounts</SectionTitle>
            <UserSections linking name={"HauDaHell"} />
            <UserSections linking name={"HauDaHell"} />
            <AddPhone> Add a phone number</AddPhone> */}
              <SectionTitle>My Account</SectionTitle>
              <UserSections about name={"Change access details"} credentials goToPolicy={this.openDrawer.bind(this)}/>

              <SectionTitle>Notifications</SectionTitle>
              {this.state.notificationSettings &&
                <>
                  <NotificationSettings
                    boopRemainder={this.state.notificationSettings.boopStart}
                    name={"Boop starting"}
                    onChangePN={(typePN, status) => this.onChangePN(typePN, status)}
                  />
                  <NotificationSettings
                    boopRemainder={this.state.notificationSettings.boopNewComment}
                    name={"New comments"}
                    onChangePN={(typePN, status) => this.onChangePN(typePN, status)}
                  />
                </>
              }

              <SectionTitle>Time Zone</SectionTitle>
              <UserSections time name={this.state.timezoneDisplay} />
              <SectionTitle>About boop</SectionTitle>
              <UserSections about name={"Send Feedback"} feedback goToPolicy={this.openDrawer.bind(this)}/>
              <UserSections about name={"Rate Boop"} terms goToPolicy={this.rateBoop} />
              <UserSections
                about
                name={"Privacy Policy"}
                terms
                goToPolicy={this.privacyPolicy}
              />
              <UserSections
                about
                name={"Terms of Service"}
                terms
                goToPolicy={this.termsAndPolicy}
              />
              <UserSections about name={"Logout"} logout signOut={this.signOut} />
            </StyledContent>
          </Content>

          <Modal
            animationType="slide"
            transparent={true}
            visible={!!this.state.modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false })}
          >
            <CloseModalOverlay
              onPressOut={() => this.setState({ modalVisible: false })}
            >
              <ModalContainer>
                <ModalMenu>
                </ModalMenu>
              </ModalContainer>
            </CloseModalOverlay>
          </Modal>
        </Container>
        </Drawer>
      </Root>
    );
  }

  generateStatus(type) {
    if (type == "Friend request recieved") return "friendRequestReceived";
    if (type == "Friend request accepted") return "friendRequestConfirmed";
    if (type == "Boop recieved") return "boopReceived";
    if (type == "Boop starting") return "boopRemainder";
    if (type == "Boop status update (For hosts only)") return "boopResponded";
  }

  onChangePN = (type, status) => {
    var statuskey = this.generateStatus(type);
    this.setState(state => ({
      notificationSettings: {
        ...state.notificationSettings,
        [statuskey]: status,
      }
    }), () => {
      Query(Mutations.updateUser, {
        input: {
          id: this.state.userId,
          notificationSettings: JSON.stringify(this.state.notificationSettings),
          timezone: this.state.timezone
        }
      })
        .then(res => {

        })
        .catch(error => console.log("Create User Error: ", error));
    });


  };

  getPermissionAsync = async () => {
    // if (Constants.platform.ios) {
    //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //   if (status !== "granted") {
    //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //      alert("Sorry, we need camera roll permissions to make this work!");
    //   }
    // }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3]
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      FileSystem.getInfoAsync(result.uri).then(uri => {
        try {
          
          const type = uri.uri.substr(uri.uri.lastIndexOf(".") + 1).toLowerCase();

          if (type == "jpg" || type == "jpeg" || type == "png") {
            if ((uri.size / 1048576).toFixed(3) < 5){
              this.saveChanges(this.props.user);
              Toast.show({
                text: `Upload Successful`,
                buttonText: ''
              })
            }
            else {
              Toast.show({
                text: `Please upload image size less than 5MB`,
                buttonText: ''
              })
              this.setState({ image: this.props.userImage })
            }
          }
          else {
            Toast.show({
              text: `image type is not acceptable`,
              buttonText: ''
            })
            this.setState({ image: this.props.userImage })
          }
        }
        catch (er) {
          console.log("Image Picker Error: ", er)
        }


      })
    }


  };

  rateBoop() {
    if (Constants.platform.ios) {

    }
    else
      Linking.openURL("https://play.google.com/store/apps/details?id=com.upcomer.boop").catch(err =>
        console.error("An error occurred", err)
      );
  }

  privacyPolicy() {
    Linking.openURL("https://boop.gg/privacy-policy").catch(err =>
      console.error("An error occurred", err)
    );
    // this.props.navigation.navigate("Policy")
  }

  termsAndPolicy() {
    Linking.openURL("https://boop.gg/terms-of-service").catch(err =>
      console.error("An error occurred", err)
    );
    // this.props.navigation.navigate("Policy")
  }

  updateUserName() {
    const { username } = this.state;
    const { email } = this.state;
    if(username != username.trim()) {
      return this.onError("Please delete any trailing spaces");
    }
    if(!(/^[a-z0-9]+$/i.test(username))) {
      return this.onError("No symbols are allowed.");
    }
    Auth.currentAuthenticatedUser().then((user) => {
      Auth.updateUserAttributes(user, {
        preferred_username: username
      }).then(res => {
        Query(Mutations.updateUser, {
          input: {
            id: this.state.userId,
            preferredUsername: username,
            timezone: this.state.timezone
          }
        })
        .then(mutationRes => {
          this.props.setUserPreferredUsername(username)
          this.setState({ modalVisible: false, isEdit: false });
        })
      }).catch(err => this.onError(err));
    }).catch(err => console.log("Update User Error: ", err));
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

  async saveChanges(user) {
    try {
      this.setState({ waiting: true, error: "" });
      const { username, image, email } = this.state;
      if (!image) {
        return;
      }
      const imageName = image.slice(image.lastIndexOf("/") + 1);
      const randomID = uuid.v1();
      const response = await fetch(image);
      const fileObject = await response.blob();
      Storage.put(`images/profile/${randomID}/${imageName}`, fileObject, {
        level: "public",
        contentType: `image/${imageName.slice(imageName.lastIndexOf(".") + 1)}`
      })
        .then(result => {

          Query(Mutations.createUserProfilePicture, {
            input: {
              fullsize: { key: result.key },
              bucket: `${awsconfig.aws_user_files_s3_bucket}`
            }
          }).then(picRes => {

            Query(Mutations.updateUserProfilePicture, {
              input: {
                id: this.state.userId,
                userProfilePictureId: picRes.data.createImage.id
              }
            })
              .then(res => {
                this.props.setUserProfilePicture(res.data.updateUser.profilePicture);
              })
              .catch(error => console.log("Create User Error: ", error));
          });
        })
        .catch(err => {
          console.log(err);
        });
    } catch (e) {
      console.log(e);
    }
  }

  changeName(user, image) {
    const { username } = this.state;
    const { email } = this.state;
    Auth.updateUserAttributes(user, {
      preferred_username: username,
      email
    }).then(res => console.log(res)).catch(err => console.log(err));


  }

  onError(err) {
    let message = err.message || err;
    if (message.startsWith("Invalid phone number")) {
      // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
      message =
        "Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.";
    }
    if(message.startsWith("Already found an entry for the provided username.")) {
      message = "Username already taken"
    }
    this.setState({ error: message, waiting: false });
  }
}

const mapStateToProps = state => {
  return {
    device: state.user.device,
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    scrubUser: () => {
      dispatch(ScrubUser())
    },
    setUserProfilePicture,
    setUserPreferredUsername,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const ErrorMsg = styled.Text`
  color: ${COLORS.RED};
  align-self: center;
`;
const StyledContent = styled(Content) ``;
const HalfCircle = styled.View`
  height: 50px;
  width: 100px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  flex: 1;
`;
const ImageButton = styled(Button) `
  width: 100px;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  justify-content: center;
  padding-bottom: 15px;
  align-items: flex-end;
  background-color: "rgba(0, 0, 0, 0.3)";
`;
const ImageButtonContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const EditImge = styled.View`
  flex-direction: row;
  align-self: center;
`;
const EditIcon = styled.View`
margin-left: 5;
`;
const ErrorMessage = styled.Text`
  color: red;
`;
const HeaderButton = styled.TouchableOpacity`
  margin-right: 10px;
`;
const SectionTitle = styled.Text`
  color: #813AC2;
  padding: 10px;
  font-family: montserrat-semibold;
  font-size: 16;
  margin-top: 28;
`;
const Username = styled.Text`
  flex: 1;
  font-size: ${wp("3.3%")};
  margin-left: ${wp("2.4%")};
`;

const AddPhone = styled.Text`
  color: ${COLORS.BLUE};
  padding: 10px;
`;
const UserNameText = styled.View`
  margin-bottom: 10px;
`;
const UsernameEdit = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;
const InputItem = styled.View`
  border-color: rgba(0, 0, 0, 0.25);
  background-color: ${COLORS.TRUE_WHITE};
  margin-bottom: 5px;
  border-width: 1px;
  border-radius: 5px;
  height: 50px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-horizontal: 10;
  height: 48;
  padding: 10px;
`;
const ModalMenu = styled.KeyboardAvoidingView`
  background-color: white;
  padding: 10px;
  padding-bottom: 10px;
 
  flex-direction: column;
`;

const ModalContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
`;

const CloseModalOverlay = styled(TouchableWithoutFeedback) ``;
const ButtonView = styled.View`
  margin-bottom: 5px;
  justify-content: flex-end;
  align-self: flex-end;
  height: 54px;
  border-radius: 3px;
`;