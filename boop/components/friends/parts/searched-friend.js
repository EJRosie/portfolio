/*
IF the friendSent is not empty then then that user is the sender and you are the receiver,
 - pending -> Show Accept/Ignore button
 - ignored -> You have already ignored that request and display that it is ignored.
 - accepted -> Display a flag that indicates you are already friends. May be "Remove" button?

ELSE IF the friendReceived is not empty then he is the receiver and you are the sender,
 - pending -> Show "Reqeust already sent"
 - ignored -> Show "Reqest arleady sent"
 - accepted -> Display a flag that indicates you are already friends. May be "Remove" button?

ELSE
 - no relationships yet. Simply display the "Add" button.
 */


import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../../../../native-base-theme/variables/material';
import { Button, Text, Icon} from 'native-base';
import {View, Image, TouchableOpacity} from 'react-native';
import {Storage} from 'aws-amplify';

export default class SearchedFriend extends React.Component {
  state = {
    added: false,
    friend: false,
    rejected: false,
    image: null
  }

  componentDidMount() {
    if(!this.props.user || !this.props.user.profilePicture) {return;}
      Storage.get(this.props.user.profilePicture.thumbLarge.key, {level: 'public'}).then(res => this.setState({image: res}));
  }

  render() {
    const {user} = this.props;
    var status = "none"; // Can be none, friend, answerThem, alreadySent.
    const friendSent = user.friendSent.items;
    const friendReceived = user.friendReceived.items;
    if(friendSent.length > 0) {
      var request = friendSent[0].requestStatus;
      if(request == "pending") {status = "answerThem";}
      else if(request == "accepted") {status = "friend";}
    }
    else if (friendReceived.length > 0) {
      var request = friendReceived[0].requestStatus;
      if(request == "accepted") {status = "friend";}
      else{status = "alreadySent";}
    }
    const friend = this.state.friend || status == "friend";
    if(this.state.rejected) {return null;}
    return (
      <SingleUserCard>
        <TouchableOpacity onPress={()=>this.props.gotoPublicProfile(user)}>
        <UserImage source={!!this.state.image ? {uri: this.state.image} : require('../../../../assets/images/Avatar.png')}/>
        </TouchableOpacity>
       
        <Username onPress={()=>this.props.gotoPublicProfile(user)}>{user.preferredUsername}</Username>
        {
          this.state.added || status == "alreadySent" ?
          <ActionButton bordered style={{borderColor: "white"}}>
            <ButtonText style={{}}>Request sent!</ButtonText>
          </ActionButton>
          :
          friend ?
          <ActionButton bordered style={{borderColor: "#813AC2"}} onPress={() => this.boopFriend()}>
            <ButtonText style={{}}>boop</ButtonText>
          </ActionButton>
          :
          status == "answerThem" ?
          <View style={{flexDirection: "row"}}>
            <ActionButton onPress={() => this.acceptRequest(user)} style={{backgroundColor: "#66E29F", borderColor: "#66E29F", width: 80}}>
              <ButtonText style={{}}>Accept</ButtonText>
            </ActionButton>
            <ActionButton onPress={() => this.rejectRequest(user)} bordered style={{backgroundColor: "white", borderColor: "rgba(0, 0, 0, 0.6)", width: 80, marginLeft: 5}}>
              <ButtonText style={{color: "rgba(0, 0, 0, 0.6)"}}>Ignore</ButtonText>
            </ActionButton>
          </View>
          :
          <ActionButton bordered onPress={() => this.addFriend()}>
            <ButtonText>Add Friend</ButtonText>
          </ActionButton>
        }    
        {/* {friend || status != "answerThem" ?
          <ActionButton bordered disabled={this.state.added || status == "alreadySent"} info bordered={friend || this.state.added || status == "alreadySent"} onPress={() => this.handlePress(friend)}><ButtonText>{friend ? "Boop" : this.state.added ? "Request Sent" : status == "alreadySent" ? "Request sent!" : "Add Friend"}</ButtonText></ActionButton>
        :
          <>
          <AnswerButton info onPress={() => this.acceptRequest(user)}><ButtonIcon type="FontAwesome5" name='check' /><ButtonText>Accept</ButtonText></AnswerButton>
          <AnswerButton bordered info onPress={() => this.rejectRequest(user)}><ButtonIcon type="FontAwesome5" name='times' /><ButtonText>Ignore</ButtonText></AnswerButton>
          </>
        } */}

        <Button transparent light 
          onPress={() => {
            this.props.openDotMenu(user);
          }}
        >
        <Text><Icon style={{fontSize: 18, color: "rgba(0, 0, 0, 0.25)"}} type="FontAwesome5" name="ellipsis-v" /></Text>
        </Button>
      </SingleUserCard>
    );
  }

  acceptRequest(user) {
    this.props.acceptRequest(user.friendSent.items[0]);
    this.setState({friend: true});
  }

  rejectRequest(user) {
    this.props.acceptRequest(user.friendSent.items[0]);
    this.setState({rejected: true});
  }

  boopFriend() {
    console.log("boop friend")
    return this.props.boopFriend(this.props.user);
  }

  addFriend() {
    this.setState({added: true});
    this.props.addFriend(this.props.user);
  }
}
const UserImage = styled.Image`
  width: 32;
  height: 32;
  border-radius: 16;
`;
const ButtonText = styled(Text)`
  margin: 0;
  font-family: montserrat-semibold;
  font-size: 12;
`;
const ActionButton = styled(Button)`
  border-radius: 100;
  height: 32;
  justify-content: center;
  align-items: center;
  align-self: center;
`;
const AnswerButton = styled(ActionButton)`
  width: auto;
`;
const ButtonIcon = styled(Icon)`
  font-size: ${wp('3.3%')};
  margin: 0;
  margin-left: ${wp('1.5%')};
`;
const Username = styled.Text`
  flex: 1;
  font-family: montserrat;
  font-size: 14;
  color: rgba(0, 0, 0, 0.6);
  margin-left: ${wp('2.8%')};
`;
const SingleUserCard = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;