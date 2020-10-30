import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Container, Content, List, ListItem, Drawer, Button, Icon } from 'native-base';
import Section from './parts/list-section';
import Item from './parts/friend-request';
import OutGoingItem from './parts/friends-outgoing';
import Header from '../common/header';
import { TouchableOpacity,RefreshControl } from 'react-native';
import Query from '../../api';
import * as Queries from '../../graphql-custom/friends/queries';
import * as Mutations from '../../graphql-custom/friends/mutations';
import { addMoreFriends, removeFriend, requestFriend, deleteRequest, acceptRequest, setFriends, setFriendRequests } from '../../actions/friends';
import { StackActions } from 'react-navigation';
import { COLORS } from "../../../native-base-theme/variables/material";

 class FriendRequests extends React.Component {
  state={
    refreshing: false
  }
  componentDidMount(){
  }
  render() {
    return (
      <Container>
        <Header 
          leftButton={
            <HeaderButton onPress={() => this.navigateToFriends()}>
              <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
            </HeaderButton>
          }
          title={"Friend Requests"}
        />
         <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          removeClippedSubviews={true}
          scrollEventThrottle={300}
          onScroll={this.setCurrentReadOffset}
          ref={(ref) => { this.scroller = ref; }} 
        >
          <List>
          {this.props.requests.length>0 &&
            <Section title={"Incoming Requests"}>
              {this.props.requests.map((inv) =>
                <Item user={inv} gotoPublicProfile={this.navigateToProfile.bind(this)} acceptRequest={this.acceptRequest} rejectRequest={this.rejectRequest}/>
              )}             
            </Section>
          }
          {this.props.outGoing.length>0 &&
            <Section title={"Outgoing Requests"}>
              {this.props.outGoing.map((inv) =>
                <OutGoingItem user={inv} gotoPublicProfile={this.navigateToProfile.bind(this)} cancelRequest={this.cancelRequest} key={inv.id}/>
              )}             
            </Section>
          }
          </List>
        </Content>
      </Container>
    );
  }

  setCurrentReadOffset = () => {
    return;
  }
  onRefresh = () => {
    const onRefresh = this.props.navigation.getParam('onRefresh', () => {});
    onRefresh();
    this.setState({refreshing: false});
  }

  navigateToFriends = () => {
    this.props.navigation.navigate("Friends");
  }

  navigateToProfile = (user) => {
    const pushAction = StackActions.push({
      routeName: 'PublicProfile',
      params: {id: user.id, name: user.preferredUsername}
    });
    this.props.navigation.dispatch(pushAction);
  }

  cancelRequest=(request)=> {
    this.props.dispatchDeleteRequest(request);
    Query(Mutations.deleteFriendRequest, {input: {id: request.id}});
    Query(Queries.listFriendRequestsSent, {requestStatusCreatedAt: {beginsWith: {requestStatus: `pending`}},friendSenderId:  this.props.user.id,
    sortDirection: "DESC"  });
  }

  acceptRequest=(request) =>{
    Query(Mutations.acceptFriendRequest, {input: {id: request.id, requestStatus: `accepted`, createdAt: request.createdAt}}).then((res) => {
      Query(Queries.userRelationByUserIdIsFriend, {
        userToUserRelationUserId: user.attributes.sub,
        isFriendBoopMutualCount:{ge: {isFriend: 1}},
        sortDirection: "DESC",
        filter: {
          isFriend: {eq: 1},
          isBlocked: {eq: 0}
        },
        limit: 20,
      }).then((res) =>{ this.props.dispatchSetFriends(res.data.userRelationByUserIdIsFriend); });
      this.props.dispatchDeleteRequest(request);
    });
  }
  rejectRequest=(request)=> {
    Query(Mutations.ignoreFriendRequest, {input: {id: request.id, requestStatus: `ignored`, createdAt: request.createdAt}});
    this.props.dispatchDeleteRequest(request);
  }
}

const mapStateToProps = (state) => {
  return { 
    user: state.user.user,
    requests: state.friends.requests, 
    outGoing: state.friends.outgoingRequests,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchRequestFriend: (friend) => {
      dispatch(requestFriend(friend))
    },
    dispatchDeleteRequest: (request) => {
      dispatch(deleteRequest(request))
    },
    dispatchSetFriends: (friends) => {
      dispatch(setFriends(friends))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequests);

const HeaderButton = styled.TouchableOpacity`
margin-right: 10px;
`;