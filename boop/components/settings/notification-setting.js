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
  Spinner
} from "native-base";

import { COLORS } from "../../../native-base-theme/variables/material";

export default class NotificationSetting extends React.Component {
  state = {
    username: "",
  };

  _handleToggleSwitch = type => {
    this.props.onChangePN(type, !this.state.switchValue);
    this.setState(state => ({
      switchValue: !state.switchValue
    }));
  };

  componentDidMount(){
   
    this.setState({switchValue:this.props.boopRemainder})
  }

//   static getDerivedStateFromProps(props) {
//     return { switchValue: props.boopRemainder };
//   }

  render() {
    let { image } = this.state;
    return (
      <SingleUserCard
       
       
        
      >
        
        <Username>
          {this.props.name}
        </Username>
       
       
        
          <Switch
            thumbColor="white"
            trackColor={{
              true: "blue",
              false: "grey"
            }}
            ios_backgroundColor="#a9a9a9"
            onValueChange={() => this._handleToggleSwitch(this.props.name)}
            value={this.state.switchValue}
          />
   
      </SingleUserCard>
    );
  }
 
}

const Username = styled.Text`
  flex: 1;
  font-family: montserrat;
  font-size: 16px;
  margin-left: ${wp("2.4%")};
  color: rgba(0, 0, 0, 0.6);
`;
const UserImage = styled.Image`
  width: ${wp("9%")};
  height: ${wp("9%")};
`;

const SingleUserCard = styled.View`
  padding: 11px;
  flex-direction: row;
  align-items: center;
  
`;
