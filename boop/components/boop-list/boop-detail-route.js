import React, { Fragment } from 'react';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import * as Mutations from '../../graphql-custom/boops/mutations';
import * as FriendMutations from '../../graphql-custom/friends/mutations';
import * as ReportMutations from '../../graphql-custom/reports/mutations';
import * as CommentMutations from  '../../graphql-custom/comments/mutations';

import * as BlockMutations from '../../graphql-custom/blocks/mutations'

import Query from '../../api';
import { StackActions } from 'react-navigation';

import { TouchableWithoutFeedback,SafeAreaView,  RefreshControl, KeyboardAvoidingView, Keyboard } from 'react-native';
import { COLORS } from '../../../native-base-theme/variables/material';
import { Container, Content, Body, Button, Icon, Text, View, Toast, Root, Input, Item } from 'native-base';
import Header from '../common/header';
import BoopIcon from './parts/boop-icon';
import moment from 'moment';
import InviteeButton from './parts/invitee-button';
import ReplyButtons from './parts/reply-buttons';
import BoopComments from './parts/boop-card-comments';
import * as Queries from "../../graphql-custom/boops/queries";
import Modal from '../common/modal';
import ReplyBar from './parts/comment-parts/boop-comment-bar';
import {deleteSpecificBoop, AddBoopToScheduled, updatePendingBoop, updateSpecificBoopActive, updateSpecificBoopPending, setPendingBoops, setScheduledBoops } from '../../actions/boops';
import { addOutgoingRequest, addBlock, deleteBlock } from '../../actions/friends';
import { TouchableOpacity } from 'react-native-gesture-handler';
var uuid = require('react-native-uuid');


class BoopDetails extends React.Component {
  state = {
    modalVisible: false,
    boop: null,
    refreshing: false,
    changedMessage: null,
    editBoopModal: false,
    clickedRefresh: false,
    isFrom: null,
    comment: "",
    newComment: "",
  }

  componentDidMount() {
    this.ref = React.createRef();
  
    const boopID = this.props.navigation.getParam('boopID', null);
    if(!!boopID) {
      Query(Queries.getBoop, {
        id: boopID
      }).then(res => {
        this.updateBoopLists();
        this.setState({ boop: res.data.getBoop, isFrom: "pending" });
      });
    }
    else {
      this.setState({ boop: this.props.navigation.getParam('boop'), isFrom: this.props.navigation.getParam('isFrom') });
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.navigation.getParam('isFrom') !== prevProps.navigation.getParam('isFrom')){
      if(this.props.navigation.getParam('isFrom') == 'edit'){
        this.setState({ boop: this.props.navigation.getParam('boop'), isFrom: this.props.navigation.getParam('isFrom') });
      }
    }
  }

  showBoopEditMenu() {
    this.setState({ editBoopModal: true, modalVisible: true });
  }

  onRefresh = () => {
    this.setState({ clickedRefresh: true, refreshing: true });
    Query(Queries.getBoop, {
      id: this.state.boop.id
    }).then(res => {
      this.setState({ boop: res.data.getBoop });
      this.setState({ refreshing: false });
    }).catch((err) => {
      this.setState({ refreshing: false })
    });
  };

  onScrollBeginDrag = () => {
    Keyboard.dismiss();
  }

  render() {
    if (!this.state.boop) { return null; }
    const { boop } = this.state;
    const ownBoop = this.props.user.id == boop.hostUser.id;
    
    return (
      <Root>
        <Container>

          <Header
            leftButton={
              <Button transparent onPress={() => this.goBack()}>
                <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
              </Button>
            }
            rightButton={
              <Button transparent onPress={() => this.showBoopEditMenu()}>
                <Icon style={{ color: COLORS.WHITE }} type="FontAwesome5" name="ellipsis-v" />
              </Button>
            }
            title={
              <>
                <BoopIcon status={"host"} user={boop.hostUser} self={ownBoop} />
                <Text style={{color: COLORS.WHITE}}><EM>{boop.hostUser.preferredUsername}</EM> booped</Text>
              </>
            }
          />
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{flex: 1}}>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            onScrollBeginDrag={this.onScrollBeginDrag}
          >
            {this.renderBoopInfo(boop)}
            {this.renderStatusLine()}
            {this.renderBoopInvites(boop.invites)}
            <BoopComments newComment={this.state.newComment} full={true} boop={boop} user={this.props.user}/>
          </Content>
          <ReplyBar
            comment={this.state.comment}
            onChange={(text) => this.setState({comment: text})}
            onSend={() => this.sendComment()}
          />
          </SafeAreaView>
          </KeyboardAvoidingView>
          <Modal
            show={this.state.modalVisible}
            close={() => this.setState({ modalVisible: false, editBoopModal: false })}
            buttons={
              this.state.editBoopModal ?
                ownBoop == true ?
                  [
                    {iconName: "pencil-alt", text: "Edit Boop", iconColor: COLORS.DARK_GREY, function: () => this.editBoop()},
                    {iconName: "user-times", text: "Delete Boop", function: () => this.deleteBoop()},
                  ]
                :
                  [
                    {iconName: "user-times", text: "Report Boop", function: () => this.reportUser(this.state.boop, "boop")},
                  ]
              :
                [
                  {iconName: "pencil-alt", text: "Edit USER???", iconColor: COLORS.DARK_GREY, function: () => this.editBoop()},
                  {iconName: "user-times", text: "Delete USER???", function: () => this.deleteBoop()},
                ]
            }/>
        </Container>
      </Root>
    );
  }

  renderBoopInfo(boop) {
    const gameNames = [];
    boop.games.items.map(gameObj => {
      if ((boop.games.items.length >= 3 || gameObj.game.forceShortTitle) && gameObj.game.shortTitle)
        gameNames.push(gameObj.game.shortTitle)
      else
        gameNames.push(gameObj.game.title)
    });
    let namesString = gameNames.length > 1 ? gameNames.slice(0, -1).join(", ") + " or " + gameNames.slice(-1) : gameNames;
    return (
      <BoopInfo>
        <InfoView>
          <GameIcon style={{color: COLORS.GREY, width: 40}} type="FontAwesome5" name="gamepad" />
          <InfoTextView>
            <InfoText>{namesString}</InfoText>
          </InfoTextView>
        </InfoView>
        <InfoView>
          <InfoIcon style={{color: COLORS.GREY, width: 40}} type="MaterialCommunityIcons" name="clock" />
          <InfoTextView>
            {moment().seconds(-900).milliseconds(0).toISOString() >= moment(boop.playtime).seconds(0).milliseconds(0).toISOString() ? <InfoText style={{color: `${COLORS.RED}`}}>Right now </InfoText>
              :
              <InfoText>{moment(boop.playtime).format("h:mm A")} - {`(${moment(boop.playtime).fromNow()})`}</InfoText>
            }
            <InfoSubtext>Invite sent {moment(boop.updatedAt).fromNow()}</InfoSubtext>
          </InfoTextView>
        </InfoView>
        {boop.title &&
          <InfoView>
            <InfoIcon style={{color: COLORS.GREY, width: 40}} type="FontAwesome5" name="comment-alt" />
            <InfoTextView>
              <InfoText>{boop.title}</InfoText>
            </InfoTextView>
          </InfoView>
        }
      </BoopInfo>

    );
  }

  renderStatusLine() {
    if (this.state.boop.invites.items.length < 3) { return null; }
    var statuses = [0, 0, 0, 0];
    this.state.boop.invites.items.forEach((ele) => {
      switch (ele.rsvp) {
        case "yes":
          statuses[0] += 1;
          break;
        case "later":
          statuses[1] += 1;
          break;
        case "no":
          statuses[2] += 1;
          break;
        default:
          statuses[3] += 1;
          break;
      }
    });
    return (
      <StatusLineContainer>
        {statuses[0] > 0 && <StatusText> <ColoredIcon type="Octicons" solid color={COLORS.GREEN} name={"primitive-dot"} /> {statuses[0]} <Bold>I'm In</Bold></StatusText>}
        {statuses[1] > 0 && <StatusText> <ColoredIcon type="Octicons" solid color={COLORS.YELLOW} name={"primitive-dot"} /> {statuses[1]} <Bold>Later</Bold></StatusText>}
        {statuses[2] > 0 && <StatusText> <ColoredIcon type="Octicons" solid color={COLORS.RED} name={"primitive-dot"} /> {statuses[2]} <Bold>Nope</Bold></StatusText>}
        {statuses[3] > 0 && <StatusText> <ColoredIcon type="Octicons" solid color={COLORS.GREY} name={"primitive-dot"} /> {statuses[3]} <Bold>Awaiting</Bold></StatusText>}
      </StatusLineContainer>
    );
  }

  renderBoopInvites(invites) {
    boop_invites = [];

    invites.items.forEach(invite => {
      if (invite.invitee.id == this.props.user.id)
        boop_invites = [this.renderSingleInvite(invite), ...boop_invites];
      else
        boop_invites = [...boop_invites, this.renderSingleInvite(invite)];
    })

    return boop_invites;
  }

  renderSingleInvite(invite) {
    const self = this.props.user.id == invite.invitee.id;
    const ownBoop = this.props.user.id == this.state.boop.hostUser.id;
    const friendsIds = this.props.friends.map(friend => friend.otherUser.id);
    const notFriend = invite.invitee.friendSent.items.length == 0 && invite.invitee.friendReceived.items.length == 0 && !(invite.invitee.id in friendsIds);
    const friendReceived = invite.invitee.friendReceived.items.length > 0 && invite.invitee.friendReceived.items[0].requestStatus
    const friendSent = invite.invitee.friendSent.items.length > 0 && invite.invitee.friendSent.items[0].requestStatus
    const inviteeButtonType = self ? "" : invite.reminderSent == true ? "reminded": ownBoop ? "boop" : notFriend ? "add" : (friendSent == "pending" || friendReceived == "pending") ? "Request Sent" :  "";
    const response = invite.invitee.rsvp == "yes" ? "I'm Down" : invite.invitee.rsvp == "later" ? "Later" : invite.invitee.rsvp == "no" ? "Nope" : "Awaiting Reply";
    return (
      <SingleUserCard key={invite.invitee.id} self={self}>
        <UserView>
          <StyledBoopIcon self={self} user={invite.invitee} status={invite.rsvp} onPress={!self ? () => this.gotoPublicProfile(invite.invitee) : null} />
          <View style={{flex: 1}}>
            <Username onPress={!self ? () => this.gotoPublicProfile(invite.invitee) : null}>{invite.invitee.preferredUsername}</Username>
            <Response>{response}</Response>
          </View>
          {
            !self &&
            <InviteeButton type={inviteeButtonType} invite={invite} user={this.props.user} ownBoop={ownBoop}/>
          }
          <TouchableOpacity style={{height: 32, width: 32, marginLeft: 15}} onPress={() => this.setState({ modalVisible: true })}>
            <Icon style={{ color: '#A3A3A3', fontSize: 24, lineHeight: 32 }} type="FontAwesome" name="ellipsis-v"/>
          </TouchableOpacity>
        </UserView>
        {(self &&
          <ReplyButtons
            updateReply={(reply, msg) => this.updateReply(reply, msg, invite.invitee.id)}
            message={invite.comment}
            response={invite.rsvp}
          />
        )}
      </SingleUserCard>
    );
  }

  deleteInvite(boopInvite) {
    const newInvites = this.state.boop.invites.items.filter(inv => inv.id !== boopInvite.id);
    var updatedBoopDetail = {
      ...this.state.boop,
      invites: {
        ...this.state.invites,
        items: newInvites
      }
    };
    var updatedBoop= {
      boop: updatedBoopDetail
    }
    this.setState({ boop: updatedBoop.boop, modalVisible: false });
    this.props.updateBoop(updatedBoop);
    Query(Mutations.deleteBoopInvite, { input: { id: boopInvite.id } }).then(res => {
      Query(Mutations.removeInviteeIdFromBoop, { input: { inviteeId: boopInvite.id, id: this.state.boop.id } });
    });
  }

  goBack() {
    this.props.navigation.navigate("Your Boops", {UpdatedBoop: true});
  }

  gotoPublicProfile = (friend) => {
    const pushAction = StackActions.push({
      routeName: 'PublicProfile',
      params: { id: friend.id, from: "BoopDetails", name: friend.preferredUsername}
    });
    this.props.navigation.dispatch(pushAction);
  }

  reportUser(boopInvite, type) {
    Query(ReportMutations.createReport, { input: { itemId: boopInvite.hostUser.id, itemType: type, reportReporterId: this.props.user.id } });
    Toast.show({
      text: `Successfully reported the ${type}`,
      buttonText: ''
    })
    this.setState({ modalVisible: false });
  }

  blockUser(boopInvite) {
    Query(FriendMutations.createBlockCustom, { blockeeId: boopInvite.invitee.id }).then(res => {      
      this.props.addBlock(res.data.createBlockCustom);
      Toast.show({
        text: `Successfully blocked the user`,
        buttonText: ''
      })

    });
    this.setState({ modalVisible: false });
  }

  updateReply(reply, msg, ownID) {
    Query(Mutations.updateBoopInvite, {input: {boopInviteBoopId: this.state.boop.id, boopInviteInviteeId: this.props.user.id, rsvp: reply, note: message}});
    const message = msg ? msg.trim() : msg;
    const newInvites = (this.state.boop.invites.items || []).map((inv) => {
      if (inv.invitee.id !== ownID) { return inv; }
      return {...inv, comment: message, response: reply, rsvp: reply}
    })

    var updatedBoopDetail = {
      ...this.state.boop,
      invites: {
        ...this.state.invites,
        items: newInvites
      }
    };

    var updatedBoop = {
      boop: updatedBoopDetail
    }
    this.setState({ boop: updatedBoop.boop });
    if (reply == "yes") {
      if (this.state.isFrom == "pending") {
        this.props.deleteBoop(updatedBoop);
        this.props.AddBoopToScheduled(updatedBoop)
      }
      else {
        this.props.updateSpecificBoopActive(updatedBoop);
      }
    }
    else {
      if (this.state.isFrom == "active") {
        this.props.updateSpecificBoopActive(updatedBoop);
      }
      else {
        this.props.updateSpecificBoopPending(updatedBoop);
      }
    }
    const refresh = this.props.navigation.getParam('refresh', this.updateBoopLists);
    refresh();
  }

  deleteBoop() {
    this.props.deleteBoop({boop: this.state.boop});
    Query(Mutations.deleteBoop, { input: { id: this.state.boop.id } }).then((res) => {
      this.setState({ modalVisible: false });
      this.props.navigation.navigate("Your Boops");
    }).catch(err => console.log(err));
  }

  editBoop = () => {
    const id = this.state.boop.id;
    const title = this.state.boop.title;
    const playtime = this.state.boop.playtime;
    this.setState({ modalVisible: false });

    const editItem ={
      id,
      title,
      playtime,
      
      games:this.state.boop.games.items,
      invites: this.state.boop.invites.items,
    }

    const pushAction = StackActions.push({
      routeName: 'EditBoop',
      params: {edit: editItem, editFrom:"edit", isFrom: this.props.isFrom }
    });
    this.props.navigation.dispatch(pushAction);
  }

  updateBoopLists = () => {
    Query(Queries.listPendingBoops, { 
      boopUserRelationUserId: this.props.user.id, limit: 100, sortDirection: "DESC",
      statusCreatedAt: {
        between: [
          {
            status: "pending",
            createdAt: "2017",
          },
          {
            status: "pending",
            createdAt: "2020",
          }
        ]
      },
      filter: {
        playtime: {ge: moment().add(-3, "hours").toISOString()}
      }
    }).then(pendingRes => {
      Query(Queries.listScheduledBoops, {
        boopUserRelationUserId: this.props.user.id, limit: 20, sortDirection: "ASC",
        statusPlaytime: {
          between: [
            {
              status: 'scheduled',
              playtime: moment().add(-3, "hours").toISOString()
            },
            {
              status: 'scheduled',
              playtime: moment().add(1, "year").toISOString()
            }
          ]
        },
      }).then(scheduledRes => { 
        this.props.updatePending(pendingRes.data.boopsByUserIdStatusCreatedAt);
        this.props.updateScheduled(scheduledRes.data.boopsByUserIdStatusPlaytime);  
        this.setState({ refreshing: false });      
      });
    });
  }

  sendComment(){
    if(this.state.comment.length < 1) {return;}
  
    const timestamp = moment().toISOString();
    const randomID = uuid.v1();
    const comment = this.state.comment;
    this.setState({comment: ""});

    Query(CommentMutations.createBoopComment, {
      input: { 
        id: randomID,
        boopCommentBoopId: this.state.boop.id,
        boopCommentUserId: this.props.user.id,
        text: comment,
        createdAt: timestamp,
        updatedAt: timestamp,
       }
    });

    let user = this.props.user;
    user['preferredUsername'] = user.preferredUsername;

    let newComment = {
      id: randomID,
      boopCommentBoopId: this.state.boop.id,
      boopCommentUserId: this.props.user.id,
      createdAt: timestamp,
      text: comment,
      updatedAt: timestamp,
      user: user,
    }

    this.setState({
      newComment: newComment
    });
    //Keyboard.dismiss();
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    games: state.user.games,
    friends: state.friends.friends,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePending: boops => {
      dispatch(setPendingBoops(boops));
    },
    updateScheduled: boops => {
      dispatch(setScheduledBoops(boops));
    },
    AddBoopToScheduled: (newBoop) => {
      dispatch(AddBoopToScheduled(newBoop))
    },
    deleteBoop: (newBoop) => {
      dispatch(deleteSpecificBoop(newBoop))
    },
    updatePendingBoop: (newBoop) => {
      dispatch(updatePendingBoop(newBoop))
    },
    updateSpecificBoopActive: (newBoop) => {
      dispatch(updateSpecificBoopActive(newBoop))
    },
    updateSpecificBoopPending: (newBoop) => {
      dispatch(updateSpecificBoopPending(newBoop))
    },
    addOutgoingRequest: (request) => {
      dispatch(addOutgoingRequest(request))
    },
    addBlock: (block) => {
      dispatch(addBlock(block));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BoopDetails);

const Bold = styled.Text`
  font-family: montserrat-semibold;
  font-weight: bold;
`;
const InfoTextView = styled.View`
  margin-left: 12px;
  font-family: montserrat-semibold;
  color: ${COLORS.DARK_GREY};
`;
const InfoText = styled.Text`
  font-family: 'montserrat-semibold';
  ${props => props.smaller ? `font-size: 14px;` : ""};
  color: ${props => props.now ? COLORS.RED : COLORS.DARK_GREY};
`;
const InfoSubtext = styled(InfoText)`
  font-family: 'montserrat';
  font-size: 12px;
  font-weight: 300
`;
const EM = styled.Text`
  font-weight: bold;
  font-family: montserrat-bold;
`;
const Username = styled.Text`
  font-size: 12px;
  font-weight: bold;
  font-family: montserrat;
`;
const Response = styled.Text`
  font-weight: 300;
  font-family: montserrat-light;
  font-size: 12px;
  color: ${COLORS.DARKER_GREY};
`;
const StyledBoopIcon = styled(BoopIcon) `
  margin-right: 10px;
`;

const UserView = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const StatusText = styled.Text`
  color: ${props => props.color};
  flex: 1;
  flex-basis: 25%;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
`;
const ColoredIcon = styled(Icon)`
  color: ${props => props.color};
  width: 20px;
  height: 20px;
  font-size: 30px;
  align-self: center;
`;
const StatusLineContainer = styled.View`
  justify-content: flex-start;
  flex-direction: row;
  padding: 10px;
  flex: 0;
`;

const SingleUserCard = styled.View`
  border-color: ${COLORS.LIGHTER_GREY}
  padding: 12px;
  padding-horizontal: 24px;
  flex: 1;
`;
const InfoView = styled.View`
  margin-bottom: 10px;
  flex: 1;
  flex-direction: row;
`;
const ModalButton = styled.TouchableOpacity`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: row;
`;
const BoopInfo = styled(Body) `
  padding: 10px;
  padding-top: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  flex: 1;
  align-self: stretch;
  width: ${wp('100%')};
`;
const InfoTextBody = styled(Body) `
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 10px;
`;
const InfoIcon = styled(Icon) ``;
const GameIcon = styled(InfoIcon) ``;
// const InfoIcon = styled(Icon)`
//     width: 44px;
// `;
// const GameIcon = styled(InfoIcon) ``;
