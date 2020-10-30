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

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { COLORS } from "../../../native-base-theme/variables/material";


export default class App extends React.Component {
  state = {
    username: "",
    switchValue: true
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

  // static getDerivedStateFromProps(props) {
  //   return { switchValue: props.boopRemainder };
  // }

  render() {
    let { image } = this.state;
    return (
      <SingleUserCard
        about={this.props.about}
        onPress={() =>
          this.props.logout
            ? this.props.signOut()
            : this.props.feedback
            ? this.props.goToPolicy("feedback")
            : this.props.credentials
            ? this.props.goToPolicy("credentials")
            : ""
        }
      >
        {this.props.linking && (
          <UserImage source={require("../../../assets/images/Vector.png")} />
        )}
        <Username
          notification={this.props.time}
          logout={this.props.logout}
        >
          {this.props.name}
        </Username>
        {!this.props.logout && <Button transparent light style={{alignSelf: "center"}}>
          <Text>
            <Icon
              style={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 16}}
              type="AntDesign"
              name="right"
            />
          </Text>
        </Button>}
        
        {/* {this.props.linking && (
          <Button transparent light>
            <Text>
              <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="ellipsis-v"
              />
            </Text>
          </Button>
        )} */}
        {/* {this.props.time && (
          <Button transparent light>
            <Text>
              <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="ellipsis-v"
              />
            </Text>
          </Button>
        )} */}
       
      </SingleUserCard>
    );
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
}

const Username = styled.Text`
  flex: 1;
  font-family: montserrat;
  font-size: 16px;
  margin-left: ${wp("2.4%")};
  color: rgba(0, 0, 0, 0.6);
  ${props => props.logout && `color: red;`}
`;
const UserImage = styled.Image`
  width: ${wp("9%")};
  height: ${wp("9%")};
`;
const SingleUserCard = styled.TouchableOpacity`
  height: 56;
  padding: 11px;
  flex-direction: row;
  align-items: center;
  ${props => props.about && `padding-top: 20px; padding-bottom: 20px;`}
`;
