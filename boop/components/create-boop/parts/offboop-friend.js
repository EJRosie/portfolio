import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, Text, View} from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';
import {TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {Storage} from 'aws-amplify';
import CachedImage from "../../cached-image";

export default class PickFriends extends React.Component {
  state={
    image: null
  }

  componentDidMount() {
    if(!this.props.friend || !this.props.friend.profilePicture) {return;}
    this.setState({image: this.props.friend.profilePicture});
  }

  render() {
    const {friend} = this.props;
    return (
      <FriendContainer
        active={this.props.chosen}
        onPress={() => this.props.changeFriends(friend.id)}>
        <FriendView
          style={{opacity: this.props.chosen ? 1 : 0.4}}
        >
        <FriendImage s3Image={this.state.image} preview={require('../../../../assets/images/Avatar.png')}/>
        <FriendName>Invite friend not on boop</FriendName>
        </FriendView>
      </FriendContainer>
    );
  }
}

const FriendContainer = styled(TouchableOpacity)`
  width: 78px;
  height: 72px;
  background: ${COLORS.WHITE};
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 8px;
  margin-top: 10px;
  margin-right: 1%;
  flex-basis: 24%;
  border-color: ${COLORS.PRIMARY};
  border-width: ${props => props.active ? "2px" : "0px"};
`;
const FriendView = styled.View`
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;
const FriendImage = styled(CachedImage)`
  width: 32px;
  height: 32px;
  border-radius: 50px;
`;
const FriendName = styled.Text`
`;