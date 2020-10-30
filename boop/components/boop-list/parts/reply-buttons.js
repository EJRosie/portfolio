import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, Text, View, Icon, Item, Input, Label} from 'native-base';
import { TouchableOpacity } from 'react-native';
import {COLORS} from '../../../../native-base-theme/variables/material';

export default class ReplyButtons extends React.Component {
  state = {
    replied: this.props.response,
    message: this.props.message || ""
  }

updateReply(reply){
  this.setState({replied: reply})
  this.props.updateReply(reply)
}
componentDidUpdate(prevProps){

  if(prevProps.response!=this.props.response)
  {
    this.setState({replied: this.props.response})
  }
}
  render() {
    
    return (
        <ButtonsContainer>
          <ReplyButton rounded bordered={this.state.replied !== "yes"} success onPress={() => this.updateReply("yes")}>
            <BoldText>I'm Down</BoldText>
          </ReplyButton>
          <ReplyButton rounded bordered={this.state.replied !== "later"} warning onPress={() => this.updateReply("later")}>
            <BoldText>Later</BoldText>
          </ReplyButton>
          <ReplyButton rounded bordered={this.state.replied !== "no"} danger onPress={() => this.updateReply("no")}>
            <BoldText>Nope</BoldText>
          </ReplyButton>
        </ButtonsContainer>
    );
  }
}
const BoldText = styled(Text)`
  font-weight: bold;
`;
const ReplyButton = styled(Button)`
  border-radius: 0px;
  flex: 1;
  margin: 2.5px;
  text-align: center;
  justify-content: center;
  border-radius: 100px;
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 10px;
  padding: 10px;
`;

// <UpdateButton info onPress={() => this.updateResponse()}><UpdateText>{this.props.response ? `Update` : `Confirm`} Response</UpdateText></UpdateButton>
