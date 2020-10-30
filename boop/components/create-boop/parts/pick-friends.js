import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Text, View} from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';
import {ScrollView} from 'react-native';
import FriendToPick from './friend-to-pick';
import { StackActions } from 'react-navigation';
import PickHeader from './pick-header';

export default class PickFriends extends React.Component {
  state={
    chosenTime: 0,
    mounted: false,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({mounted: true});
    }, 150)
  }

  render() {
    return (
      <PickContainer>
        <PickHeader 
          title={"Invite Friends"}
          number={3}
        />
        <Middle>
          {
            this.state.mounted && 
              this.props.friends.length > 0 ?
              <ScrollView 
                ref={(scrollView) => { this.scrollView = scrollView; }}
                pagingEnabled={true}
                scrollEnabled={this.props.friends.length > 8}
                horizontal= {true}
                decelerationRate={0}
                snapToInterval={wp('100%') - 60}
                snapToAlignment={"center"}
                contentInset={{
                  top: 0,
                  left: 30,
                  bottom: 0,
                  right: 30,
                }}>
                {this.renderFriendGroups(this.props.friends)}
              </ScrollView>
              :
              <NoFriendText><SearchText onPress={() => this.navigateToAddFriends()}>Add friends</SearchText> and they will appear here</NoFriendText>
            
          }
          
        </Middle>
      </PickContainer>
    );
  }

  renderFriend(friendRelation) {
    const friend = friendRelation.otherUser.id == this.props.user.id ? friendRelation.user : friendRelation.otherUser;
    return (
      <FriendToPick friend={friend} chosen={this.props.chosenFriends.includes(friend.id)} key={friend.id} changeFriends={this.props.changeFriends.bind(this)}/>
    );
  }

  renderFriendGroups(ListOfFriends) {
    const friends = [{user: {preferredUsername: "Invite friend not on boop", id: -1}, otherUser: {id: this.props.user.id}}, ...ListOfFriends];
    const friendSets = Math.ceil(friends.length / 8);
    const friendGroups = [];
    for(var offset = 0; offset < friendSets; offset++){
      const friendsList = [];
      for(var x = offset * 8; x < (offset*8) + 8 && x < friends.length; x++) {
        friendsList.push(
          this.renderFriend(friends[x])
        );
      }
      friendGroups.push(
        <FriendGroupContainer key={offset}>
          {friendsList}
        </FriendGroupContainer>
      );
    }
    return friendGroups;
  }

  navigateToAddFriends = () => {
    const pushAction = StackActions.push({
      routeName: 'AddFriends',
      params: {from: "New Boop", userId: this.props.user.id}
    });
    this.props.navigation.dispatch(pushAction);
  }
}
const FriendGroupContainer = styled.View`
  justify-content: flex-start;
  flex-wrap: wrap;
  width: ${wp('100%') - 60};
  flex-direction: row;
  margin-bottom: 10px;
`;
const SearchText = styled.Text`
  text-decoration-line: underline;
  color: ${COLORS.BLUE};
`;
const PickContainer = styled.View`
`;

const Middle = styled.View`
  margin-top: 10px;
  align-items: center;
  justify-content: center;
`;
const Top = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;
const Number = styled.View`
  background-color: ${COLORS.YELLOW};
  border-radius: 50px;
  padding: 1px;
  width: ${wp('5.2%')};
  height: ${wp('5.2%')};
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;
const NumberText = styled.Text`
 
`;
// const NumberText = styled.Text`
//   line-height: ${wp('3.3%')};
// `;
const NoFriendText=styled.Text`
  color: ${COLORS.GREY};
  align-self: center;
`