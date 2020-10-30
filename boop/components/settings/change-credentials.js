import React, { Component } from "react";
import { TouchableOpacity } from 'react-native';
import styled from "styled-components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {
  Container,
  Text,
  Input,
  Button,
  Content,
  Icon,
  Toast,
  View,
} from "native-base";
import Header from "../common/header";
import { COLORS } from "../../../native-base-theme/variables/material";
import { Auth } from 'aws-amplify';

export default class SendFeedBack extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailVerificationCode: '',
      emailVerified: false,
      isSendingCode: false,
      oldPassword: '',
      newPassword: '',
    };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
    .then(user => {
      console.log("USER ", user.attributes)
      this.setState({ email: user.attributes.email, emailVerified: user.attributes.email_verified })
    });
  }

  render() {
    let { image } = this.state;
    return (
        <Container>
        <Header
          leftButton={
            <HeaderButton onPress={() =>  this.props.onBackButton() }>
                <Icon style={{ color: COLORS.WHITE }} name="arrow-back" />
            </HeaderButton>
          }
          title={"My Account"}
        />
        <Content>
        <ContainerItem>
          <InputLabel>Email address</InputLabel>
          <InputItem>
            <StyledInput
              onFocus={(e) => {e.preventDefault(); e.stopPropagation();}}
              onChangeText={(text) => this.setState({ email: text})} 
              value={this.state.email}
              ref={(ref) => { this.game_input = ref; }} 
              returnKeyType={"default"}
              placeholder={ this.props.user.email || "Insert your email..." }
              placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
            />
          </InputItem>
          {
            !!this.state.email && !this.state.emailVerified &&
            <View>
              <InputLabel>Verification code</InputLabel>            
              <InputItem style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <StyledInput
                  onFocus={(e) => {e.preventDefault(); e.stopPropagation();}}
                  onChangeText={(text) => this.setState({ emailVerificationCode: text})} 
                  value={this.state.emailVerificationCode}
                  ref={(ref) => { this.game_input = ref; }} 
                  returnKeyType={"done"}
                  placeholder={"Code"}
                  placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
                />
                <TouchableOpacity style={{ marginRight: 10 }}>
                  <Text style={{ fontSize: 14, lineHeight: 24, color: '#66E29F' }}>Verify</Text>
                </TouchableOpacity>
              </InputItem>
            </View>
          }
          <PasswordHeader>Set new password</PasswordHeader>

          <InputLabel>Old password</InputLabel>
          <InputItem>
            <StyledInput
              onFocus={(e) => {e.preventDefault(); e.stopPropagation();}}
              onChangeText={(text) => this.setState({ oldPassword: text})} 
              value={this.state.oldPassword}
              ref={(ref) => { this.game_input = ref; }} 
              returnKeyType={"next"}
              placeholder={"Insert old password..."}
              placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
              secureTextEntry={true}
            />
          </InputItem>

          <InputLabel>New password</InputLabel>
          <InputItem>
            <StyledInput
              onFocus={(e) => {e.preventDefault(); e.stopPropagation();}}
              onChangeText={(text) => this.setState({ newPassword: text})} 
              value={this.state.newPassword}
              ref={(ref) => { this.game_input = ref; }} 
              returnKeyType={"done"}
              placeholder={"Insert new password..."}
              placeholderTextColor={"rgba(0, 0, 0, 0.25)"}
              secureTextEntry={true}
            />
          </InputItem>
          
          

          {/* <InputItemArea>
            <Textarea
            ref={(input) => { this.secondTextInput = input; }}
            onChangeText={text => this.setState({ feedback: text })}
            rowSpan={10} bordered placeholder="Your Feedback"  value={this.state.feedback} 
            />
          </InputItemArea> */}
          
          <SaveButton
            primary
            bordered
            rounded
            block
            large
            disabled={ (!!!this.state.oldPassword || !!!this.state.newPassword) && !!!this.state.email }
            onPress={() => this.saveChanges()}>
            <Text style={{ fontSize: 18, lineHeight: 21, fontFamily: 'gotham' }}>
              Save Changes
            </Text>
          </SaveButton>
        </ContainerItem>
        </Content>

    </Container>
    );
  }

  saveChanges = () => {
    
    if (this.state.email !== '') {
      try {
        Auth.updateUserAttributes(user, { email: this.state.email });
        this.setState({ emailVerified: false });
        Toast.show({
          text: `Verification code sent to email.`,
          buttonText: ''
        });
      } catch (e) {
      }
    }
    
    if (!!this.state.newPassword && !!this.state.oldPassword)
      Auth.changePassword(user, this.state.oldPassword, this.state.newPassword);

    this.setState({ newPassword: '', oldPassword: '' });
  };
}

const Username = styled.Text`
  flex: 1;
  font-size: 14px;
  margin-left: ${wp("2.4%")};
  ${props => props.notification && `color: ${COLORS.LIGHT_BLACK};'`}
  ${props => props.logout && `color: ${COLORS.RED};'`}
`;
// const InputItem = styled.View`
//   border-color: ${COLORS.LIGHT_GREY};
//   background-color: ${COLORS.TRUE_WHITE};
//   margin-bottom: 5px;
//   border-width: 1px;
//   border-radius: 3px;
// `;
const InputItemArea = styled.View`
  border-color: ${COLORS.LIGHT_GREY};
  background-color: ${COLORS.TRUE_WHITE};
  margin-bottom: 10px;
  padding-top:2px;
`;
const ContainerItem = styled.View`
  flex-direction: column;
  flex: 1;
  padding: 20px;
`;
const HeaderButton = styled.TouchableOpacity`
  margin-right: 10px;
`;
const StyledInput = styled(Input)`
  font-family: montserrat;
  font-size: 16;
  line-height: 24;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  border-bottom-width: 0;
`;
const InputItem = styled.View`
  border-color: rgba(0, 0, 0, 0.25);
  border-width: 1;
  border-radius: 5;
  margin-bottom: 25;
`;
const InputLabel = styled.Text`
  color: #6317C3;
  font-family: montserrat-bold;
  font-size: 12;
  line-height: 15;
  margin-bottom: 5;
`;
const PasswordHeader = styled.Text`
  color: rgba(0, 0, 0, 0.6);
  font-family: montserrat;
  font-size: 18;
  line-height: 18;
  margin-top: 15;
  margin-bottom: 30;
`;
const SaveButton = styled(Button)`
  margin: 20px;
  justify-content: center;
  align-self: stretch;
`;
