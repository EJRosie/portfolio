import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Share, ScrollView, Modal, TouchableWithoutFeedback, RefreshControl, Image, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../native-base-theme/variables/material';
import { Container, Content, List, ListItem, Drawer, Button, Icon, Left, Right, Text, View, Body, Spinner, Toast ,Root} from 'native-base';
import Section from './parts/list-section';
import SuggestedFriends from './parts/suggested-friends'
import AddFriends from './add-friends';
import * as AllQueries from '../../graphql/queries';
import * as Queries from '../../graphql-custom/friends/queries';
import * as Mutations from '../../graphql-custom/friends/mutations';
import Query from '../../api';
import FriendRequestList from './friend-requests';
import FriendRequest from './parts/friend-request';
import Friend from './parts/friend';
import Header from '../common/header';
import { addMoreFriends, removeFriend, requestFriend, deleteRequest, acceptRequest, setFriends, setFriendRequests, addBlock, deleteBlock } from '../../actions/friends';
import {ScrubUser, setTabVisibility} from '../../actions/user';
import {Auth} from 'aws-amplify';
import * as BlockMutations from '../../graphql-custom/blocks/mutations';
import Expo, { Notifications } from "expo";
import CachedImage from "../cached-image";
import { StackActions } from 'react-navigation';
import CommonModal from "../common/modal";

class FriendsList extends React.Component {

  // scrollView = React.createRef();
  state = {
    requestsDrawer: false,
    modalVisible: false,
    refreshing: false,
    confirmModal: false,
    removeFriend: null,
    isremoveModal: false,
    isOpenDrawer: false,

    suggestedFriends: []
  }

  closeDrawer() { 
    this.setState({isOpenDrawer: false})
    // Keyboard.dismiss();
    this._drawer._root.close()
   };

  openDrawer() { 
    this.setState({isOpenDrawer: true})
    this._drawer._root.open()
  };

  openProfile=() => {
    const pushAction = StackActions.push({
      routeName: 'Profile',
      params: {from: "friends"}
    });
    this.props.navigation.dispatch(pushAction);
  }

  openDrawerSearch(){
    const pushAction = StackActions.push({
      routeName: 'AddFriends',
      params: {from: "friends", userId: this.props.user.id}
    });
    this.props.navigation.dispatch(pushAction);
  }

  componentDidMount() {

    Query(AllQueries.suggestedFriendsByUserIdIgnoreStatusUpdatedAt, {
      userId: this.props.user.id,
      ignoreTypeUpdatedAt: {beginsWith: {ignoreType: "notignored"}},
      sortDirection: "DESC",
      limit: 10,
    }).then((res) => {
      this.setState({ suggestedFriends: res.data.suggestedFriendsByUserIdIgnoreStatusUpdatedAt })
    });
  }

  componentDidUpdate(prevProps){    
    if(this.props.navigation.getParam('clicked') != prevProps.navigation.getParam('clicked'))
    if(this.scroll) {this.scroll.scrollTo({x: 0, y: 0, animated: true});}
  }

  render() {
    return (
      <Root>
      <Drawer 
        ref={(ref) => { this._drawer = ref; }} 
        content={this.state.requestsDrawer ? 
          <FriendRequestList acceptRequest={this.acceptRequest.bind(this)} rejectRequest={this.rejectRequest.bind(this)} 
          outGoing={this.props.outGoing}
          cancelRequest={this.cancelRequest.bind(this)}
          requests={this.props.requests} onBackButton={this.closeFriendRequests.bind(this)} /> 
        : 
         this.state.isOpenDrawer&& <AddFriends user={this.props.user} onBackButton={this.closeDrawer.bind(this)} 
          addFriend={this.addFriend.bind(this)} boopFriend={this.boopFriend.bind(this)}
           acceptRequest={this.acceptRequest.bind(this)} rejectRequest={this.rejectRequest.bind(this)}/>} 
        onClose={() => this.closeFriendRequests()}
        openDrawerOffset={0}
        panCloseMask={0}
        side={'right'}
        tapToClose={false}
      >
      <Container>
        <Header
        scrollRef={this.scroll}
        rightButton={
          <Button transparent onPress={() => this.openDrawerSearch()}>
            <Icon style={{ color: COLORS.WHITE }} type="FontAwesome5" name='user-plus' />
          </Button>
        }
        leftButton={
          <Button transparent onPress={() => this.openProfile()}>
           <IconView self={this.props.self}>
              <IconImage
                s3Image={this.props.user.profilePicture}
                preview={require("../../../assets/images/Avatar.png")} />
            </IconView>
          </Button>
        }
        />
        <View />
        <Content
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          removeClippedSubviews={false}
          scrollEventThrottle={300}
          onScroll={this.setCurrentReadOffset}
          innerRef={ref => {this.scroll = ref}}
        >
          <List>
          {this.props.requests.length > 0 &&
            <Section title={`Friend Requests`}>
              {this.props.requests.map(request =>
                <FriendRequest
                  acceptRequest={this.acceptRequest.bind(this)}
                  rejectRequest={this.rejectRequest.bind(this)}
                  key={request.id}
                  user={request}
                  gotoPublicProfile={this.gotoPublicProfile}/>
              )}
            </Section>
          }
            {this.props.requests.length > 2 && this.props.outGoing.length == 0 &&(
            <ListItem selected onPress={this.openFriendRequests.bind(this)}>
              <Left>
                <Text>See all friend requests</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            )}
            {this.props.outGoing.length > 0 &&(
              <>
               {this.props.requests.length ==0 &&
              <Section title={`Friend Requests`}/>
               }
            <ListItem selected onPress={this.openFriendRequests.bind(this)} style={{borderBottomWidth: 0}}>
              <Left>
                <Text style={{fontFamily: "montserrat", fontSize: 14, color: "rgba(0, 0, 0, 0.6)"}}>{`See all requests (${this.props.outGoing.length} outgoing)`}</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" style={{color: "rgba(0, 0, 0, 0.6)"}}/>
              </Right>
            </ListItem>
            </>
            )}
            <SuggestedFriends
              suggestedFriends={this.state.suggestedFriends}
              gotoPublicProfile={this.gotoPublicProfile}
              addFriend={this.addFriend}/>
            {this.props.friends.length > 0 ? (
              <Section title={`Friends`}>
                {this.props.friends.map((friendRelation) => {
                    var friend = friendRelation.otherUser.id == this.props.user.id ? friendRelation.user : friendRelation.otherUser;
                    return <Friend key={friend.id} onBoop={() => this.boopFriend(friend)} 
                    friend={friend} friendRelation={friendRelation} gotoPublicProfile={this.gotoPublicProfile}
                    openDotMenu={(friend,friendRelation) => this.setState({modalVisible: friend,removeFriend:friendRelation})}/>
                })}
              </Section>
            )
            :
              (<NoneContent>
                <NoneText>This is where your friends will appear</NoneText>
                <TryText>
                  Add friends to Boop them!
                </TryText>
                <FirstBoopButton
                  info
                  onPress={() => this.openDrawerSearch()}
                >
                  <Text>Add Friends</Text>
                </FirstBoopButton>
              </NoneContent>
            )}
            { this.state.loadingMore && <Spinner color={COLORS.BLUE}/> }
            <InviteContainer>
              <Text style={{fontFamily: "montserrat", color: "rgba(0, 0, 0, 0.6)"}}>Got friends that are not on Boop yet?</Text>
              <InviteButton bordered info onPress={() => this.shareInviteLink()}><InviteText>Invite friends to Boop</InviteText></InviteButton>
            </InviteContainer>
          </List>
         
        </Content>
        <CommonModal
          show={this.state.modalVisible}
          close={() => this.setState({ modalVisible: false, confirmModal: false })}
          buttons={
            [
              {iconName: "user-times", text: "Remove Friend", iconColor: COLORS.RED, function: () => this.removeFriend()},
              {iconName: "ban", text: "Block", iconColor: COLORS.RED, function: () => this.blockFriend()},
            ]
          }/>
      </Container>
      </Drawer>
      </Root>
    );
  }

  gotoPublicProfile = (friend) => {
    const pushAction = StackActions.push({
      routeName: 'PublicProfile',
      params: {id: friend.id, name: friend.preferredUsername, from: "Friends"}
    });
    this.props.navigation.dispatch(pushAction);
  }

  openFriendRequests = () => {
    const pushAction = StackActions.push({
      routeName: 'FriendRequests',
      params: {
        requests: this.props.requests,
        outGoing: this.props.outGoing, 
        cancelRequest:(request)=>this.cancelRequest(request),
        acceptRequest: (request)=>this.acceptRequest(request),
        rejectRequest: (request)=>this.rejectRequest(request),
        onRefresh: ()=>this.onRefresh()
      }
    });
    this.props.navigation.dispatch(pushAction);
    
  }

  closeFriendRequests = () => {
    this.setState({isOpenDrawer: false})
    this.closeDrawer();
    this.setState({requestsDrawer: false});
  }

  setCurrentReadOffset = () => {
    if(!this.props.activeNext) {return;}
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    var isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50; 
    if(isCloseToBottom) {
      this.setState({loadingMore: true});
      this.listFriends().then((res) =>  {
        this.props.dispatchAddMoreFriends(res.data.userRelationByUserIdIsFriend);
        this.setState({loadingMore: false});
      });
    }
  }

  onRefresh = () => {
    this.listFriends().then((res) =>{
      this.props.dispatchSetFriends(res.data.userRelationByUserIdIsFriend)
    });
    Query(Queries.listFriendRequestsReceived, {requestStatusCreatedAt: { beginsWith : {requestStatus: `pending`}}, friendReceiverId: this.props.user.id,
    sortDirection: "DESC"}).then((res) =>{
     this.props.dispatchSetRequests(res.data.friendRequestsReceived)
    });

    Query(Queries.listFriendRequestsSent, {requestStatusCreatedAt: {beginsWith: {requestStatus: `pending`}},friendSenderId:  this.props.user.id,
    sortDirection: "DESC"}).then((res) =>{
      
      this.props.dispatchRequestFriend(res.data.friendRequestsSent)
     });

    this.setState({refreshing: false});
  }

  listFriends = async() => {
    // return Query(Queries.listFriends, {filter: {requestStatus: {eq: `accepted`}},limit:100});
    return Query(Queries.userRelationByUserIdIsFriend, {
      userToUserRelationUserId: this.props.user.id,
      isFriendBoopMutualCount:{ge: {isFriend: 1}},
      sortDirection: "DESC",
      filter: {
        isFriend: {eq: 1},
        isBlocked: {eq: 0}
      },
      limit: 20,
    });
  }

  addFriend(friend) {
    Query(
      Mutations.createFriendCustom,
      {
        friendReceiverId: friend.id,
      }).then(res => this.props.dispatchRequestFriend(res.data.createFriendCustom));
    return;
  }

  boopFriend(friend) {
    this.listFriends().then((res) => this.props.dispatchSetFriends(res.data.listFuserRelationByUserIdIsFriendriends));
    const pushAction = StackActions.push({
      routeName: 'New Boop',
      params: {preselectedFriendArray: [friend.id]}
    });
    this.props.navigation.dispatch(pushAction);
  }

  removeFriendModal() {
    // this.state.modalVisible is set to the friend that it refers to.
    this.setState({confirmModal: true, isremoveModal: true});
  }

  removeFriend() {
    // this.state.modalVisible is set to the friend that it refers to.
    Query(Mutations.removeFriend, {input: {id: this.state.removeFriend.friend.id}}).then(res=> {console.log(res); this.props.dispatchRemoveFriend(this.state.removeFriend)});
    this.setState({confirmModal: false,modalVisible: false});
  }

  blockFriend() {
    // this.state.modalVisible is set to the friend that it refers to.
    this.setState({confirmModal: true, isremoveModal: false});
  }

  blockUser(){
    Query(Mutations.createBlockCustom, {blockeeId: this.state.modalVisible.id}).then(res => {
      this.props.addBlock(res.data.createBlockCustom);
      Toast.show({
        text: `Successfully blocked the user`,
        buttonText: ''
      })
    });
    this.setState({confirmModal: false, modalVisible: false});
  }

  acceptRequest=(request) =>{
    Query(Mutations.acceptFriendRequest, {input: {id: request.id, requestStatus: `accepted`, createdAt: request.createdAt}}).then((res) => {
      // this.listFriends().then((listRes) => this.props.dispatchSetFriends(listRes.data.userRelationByUserIdIsFriend));
      this.props.dispatchAddMoreFriends({ items: [{ friend: {id: request.id}, otherUser: request.sender }] })
      this.props.dispatchDeleteRequest(request);
    });
    this.props.dispatchAcceptRequest(request);
  }

  rejectRequest=(request)=> {
    Query(Mutations.ignoreFriendRequest, {input: {id: request.id, requestStatus: `ignored`, createdAt: request.createdAt}});
    this.props.dispatchDeleteRequest(request);
  }

  cancelRequest=(request)=> {
    Query(Mutations.deleteFriendRequest, {input: {id: request.id}});
    Query(Queries.listFriendRequestsSent, {requestStatusCreatedAt: {beginsWith: {requestStatus: `pending`}},friendSenderId: this.props.user.id,
    sortDirection: "DESC" }).then((res) =>{
      this.props.dispatchRequestFriend(res.data.friendRequestsSent)
     }
     );
  }

  async shareInviteLink() {
    try {
      const result = await Share.share({
        message:
          `${this.props.user.preferredUsername} has invited you to Boop! Download it here: https://boop.gg`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    friends: state.friends.friends,
    requests: state.friends.requests,
    games: state.user.games,
    outGoing: state.friends.outgoingRequests,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchSetFriends: (friends) => {
      dispatch(setFriends(friends))
    },
    dispatchSetRequests: (requests) => {
      dispatch(setFriendRequests(requests))
    },
    dispatchRemoveFriend: (friend) => {
      dispatch(removeFriend(friend))
    },
    dispatchRequestFriend: (friend) => {
      dispatch(requestFriend(friend))
    },
    dispatchDeleteRequest: (request) => {
      dispatch(deleteRequest(request))
    },
    dispatchAcceptRequest: (request) => {
      dispatch(acceptRequest(request))
    },
    dispatchAddMoreFriends: (friends) => {
      dispatch(addMoreFriends(friends))
    },
    setTabVisible: (userName) => {
      dispatch(setTabVisibility(userName))
    },
    scrubUser: () => {
      dispatch(ScrubUser())
    },
    addBlock: (block) => {
      dispatch(addBlock(block))
    },
    deleteBlock: (block) => {
      dispatch(deleteBlock(block))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsList);

const SearchContainer = styled(ScrollView)`
  height: ${hp('55%')};
`;
const InviteContainer = styled.View`
  padding: 20px;
  align-items: center;
  justify-content: center;
`;
const InviteButton = styled(Button)`
  margin-top: 30px;
  height: 60px;
  align-self: stretch;
  justify-content: center;
  padding: 10px;
  border-radius: 100px;
`;
const InviteText = styled.Text`
  font-family: gotham;
  font-size: 18;
  color: #813AC2;
`;
const CloseView = styled.View`
  background: green;
  flex: 1;
`;
const ModalMenu = styled.View`
  background-color: white;
  padding: 10px;
  padding-bottom: 10px;
`;
const ModalBox = styled.View`
  background-color: white;
  padding: 10px;
  margin-left: 20px;
  margin-right: 20px;

`;
const ModalContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
  background-color: rgba(0,0,0,0.5);
`;
const ModalConfirmation = styled.View`
  justify-content: center;
  flex-direction: column;
  flex: 1;
  background-color: rgba(0,0,0,0.5);
`;
const CloseModalOverlay = styled(TouchableWithoutFeedback)`
`;
const InfoView = styled.TouchableOpacity`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: row;
`;
const InfoTextBody = styled(Body)`
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 10px;
`;
const NoFriendsText = styled.Text`
  margin: 20px;
  color: ${COLORS.GREY};
`;
const ModalConfirmationHeading = styled.Text`
  color: ${COLORS.BLACK};
  text-align: center;
  font-weight: bold;
  font-size: ${wp('4.5%')};
`;
const ModalConfirmationDesc = styled.Text`
  color: ${COLORS.BLACK};
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: ${wp('4%')};
`;
const ActionButton = styled(Button)`
  border-radius: 5px;
  padding-horizontal: 10px;
  margin-top: 10px;
  justify-content: center;
  
  align-self: stretch;
`;
const IconView = styled(View)`
  margin-right: ${wp("1.2%")};
`;
const IconImage = styled(CachedImage)`
  width: 48px;
  height: 48px;
  border-radius: 25px;
`;

const NoneText = styled.Text`
  text-align: center;
  width: ${wp("80%")};
  color: ${COLORS.DARKER_GREY};
  font-size: ${wp("3.8%")};
  margin-top: 20px;
`;
const TryText = styled.Text`
  text-align: center;
  width: ${wp("80%")};
  color: ${COLORS.DARKER_GREY};
  font-size: ${wp("3.3%")};
  margin-top: 10px;

`; 
const FirstBoopButton = styled(Button)`
  margin: 20px;
  justify-content: center;
  align-self: center;
`;
const FirstBoopText = styled.Text`
  color: ${COLORS.TRUE_WHITE};
  text-align: center;
  font-size: ${wp("3.75%")};
  font-weight: bold;
`;
const NoneContent = styled.View`
  align-items: center;
  justify-content: center;
  height: ${hp("40%")}
`;