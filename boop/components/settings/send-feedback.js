import React, { Component } from "react";
import { Image, Switch } from "react-native";
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
  Textarea,
  Toast
} from "native-base";
import Header from "../common/header";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as Mutations from '../../graphql-custom/reports/mutations';
import Query from '../../api';
import { COLORS } from "../../../native-base-theme/variables/material";
import email from 'react-native-email';

export default class SendFeedBack extends React.Component {
  state = {
    email: "",
    feedback: ""
  };

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
          title={"Send Feedback"}
        />
        <Content>
        <ContainerItem>
          <InputItemArea>
            <Textarea
            ref={(input) => { this.secondTextInput = input; }}
            onChangeText={text => this.setState({ feedback: text })}
            rowSpan={1} bordered placeholder="Your Feedback"  value={this.state.feedback} 
            />
          </InputItemArea>
          <ButtonView>
          <Button info disabled={this.state.feedback.length < 1} onPress={() => this.sendFeedBack()}>
            <Text>Send</Text>
          </Button>
          </ButtonView>
        </ContainerItem>
        </Content>

    </Container>
    );
  }
  sendFeedBack = () => {
    Query(Mutations.createFeedback, { input: { feedbackUserId: this.props.user.id, subject: "Boop Feedback", body: this.state.feedback } }).then(res => {
      Toast.show({
        text: `Feedback Received`,
        buttonText: ''
      });
      this.props.onBackButton();
      this.setState({feedback: ""});
    });
  };
}

const Username = styled.Text`
  flex: 1;
  font-size: 14px;
  margin-left: ${wp("2.4%")};
  ${props => props.notification && `color: ${COLORS.LIGHT_BLACK};'`}
  ${props => props.logout && `color: ${COLORS.RED};'`}
`;
const InputItem = styled.View`
  border-color: ${COLORS.LIGHT_GREY};
  background-color: ${COLORS.TRUE_WHITE};
  margin-bottom: 5px;
  border-width: 1px;
  border-radius: 3px;
`;
const InputItemArea = styled.View`
  border-color: ${COLORS.LIGHT_GREY};
  background-color: ${COLORS.TRUE_WHITE};
  margin-bottom: 10px;
  padding-top:2px;
`;
const ContainerItem = styled.View`
  
  flex-direction: column;
  flex: 1;
  padding: 10px;
`;
const HeaderButton = styled.TouchableOpacity`
  margin-right: 10px;
`;
const ButtonView = styled.View`
  flex: 1;
  justify-content: flex-end;
  flex-direction: column;
  align-self: flex-end;
`;