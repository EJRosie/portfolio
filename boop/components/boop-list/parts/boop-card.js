import React, { Component } from 'react';
import {COLORS} from '../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';

import * as Mutations from '../../../graphql-custom/boops/mutations';
import * as CommentMutations from  '../../../graphql-custom/comments/mutations';
import * as Queries from '../../../graphql-custom/boops/mutations';
import Query from '../../../api';


import {TouchableOpacity} from 'react-native';
import { Card, Text, CardItem, Right, Icon, Body, Button, View, Input, Item  } from 'native-base';
import BoopIcon from './boop-icon';
import ReplyButtons from './reply-buttons';
import Comments from './boop-card-comments';
import ReplyBar from './comment-parts/boop-comment-bar';

var uuid = require('react-native-uuid');

export default class BoopCard extends React.Component {

  state = {
    updateReply: false,
    responded: false,
    boop: this.props.boop,
    comment: ""
  }

  render() {
    const { user} = this.props;
    const {boop} = this.props.boop;
    const gameNames = [];

    if(!boop) {
      return null;
    }
    console.log(Object.keys(boop));
    let boopGames = (boop.games || {items: []});

    boopGames.items.map(gameObj => {
      if ((boopGames.items.length >= 3 || gameObj.game.forceShortTitle) && gameObj.game.shortTitle)
        gameNames.push(gameObj.game.shortTitle);
      else
        gameNames.push(gameObj.game.title);
    });

    const ownInvite = boop.invites.items.find((inv) => inv.invitee.id == user.id);
    const isNow = moment(boop.playtime).isBefore(moment());

    return (
      <Boop>
        <TouchableOpacity onPress={() => this.onPress(boop)}>
        <Content keyboardShouldPersistTaps={'handled'}>
            <Line>
              <BoopIcon status={"host"} user={boop.hostUser} self={boop.hostUser.id == user.id}/>
              <Title>{this.getTitle(boop.hostUser.id == user.id, gameNames)} </Title>
            </Line>

            <Line>
              
              { isNow?
                <>
                  <ClockIcon style={{color: `${COLORS.RED}`, fontSize: 20, margin: 6, marginRight: 18}} now type="MaterialCommunityIcons" name="clock" />
                  <TimeContainer>
                    <Time now>Right now</Time>
                    <InviteSent>Invite sent {moment(boop.playtime).fromNow()}</InviteSent>
                  </TimeContainer>
                </>
              :
                <>
                  <ClockIcon style={{color: `${COLORS.DARK_GREY}`, fontSize: 20, margin: 6, marginRight: 18}} type="MaterialCommunityIcons" name="clock" />
                  <TimeContainer>
                    <Time>{moment(boop.playtime).format("h:mm A")} - {moment(boop.playtime).fromNow()}</Time>
                    <InviteSent>Invite sent {moment(boop.updatedAt).fromNow()}</InviteSent>
                  </TimeContainer>
                </>
              }
            </Line>

            {boop.title && <Line>
              <ClockIcon type="FontAwesome5" name="comment" /> 
              <Time>{boop.title}</Time>
            </Line>}
            
            {(boop.invites.items.length == 1 && boop.hostUser.id != user.id) ||
            <UsersContainer>
              {
                boop.invites.items.map((inv, key) => (
                  <BoopUserContainer key={inv.invitee.id}>
                    <BoopIcon self={inv.invitee.id == user.id} key={inv.invitee.id} user={inv.invitee} status={inv.rsvp}/> 
                    <UserInfo>
                      <Title>{inv.invitee.preferredUsername}</Title>
                      <RSVP>{inv.rsvp == "yes" ? "I'm Down" : inv.rsvp == "no" ? "Nope" : inv.rsvp || "Awaiting reply"}</RSVP>
                    </UserInfo>
                  </BoopUserContainer>
                ))
              }
            </UsersContainer>
            }
        </Content>
      </TouchableOpacity>
      { !!ownInvite &&
        <ReplyButtons
          response={ownInvite.rsvp}
          updateReply={(reply, msg) => {this.updateReply(reply, msg, ownInvite.boopInviteInviteeId)}}
          pic={user}
        />
      }{ !this.props.archive &&
        <>
        <Comments newComment={this.state.newComment} boop={boop} user={user} key={boop.id} updateBoop={(newBoop) => this.props.updateBoops(newBoop, null)}/>
        <ReplyBar 
          comment={this.state.comment}
          onChange={(text) => this.setState({comment: text})}
          onSend={() => this.sendComment()}
        />
        </>
      }
      </Boop>
    );
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
        boopCommentBoopId: this.state.boop.boop.id,
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

  onPress(boop) {
    this.props.openDrawer(boop);
  }

  updateReply(reply, msg, ownID) {
    Query(Mutations.updateBoopInvite, {input: {boopInviteBoopId: this.props.boop.boop.id, boopInviteInviteeId: this.props.user.id, rsvp: reply, note: msg}})
    // Query(Mutations.updateBoopInvite, {input: {boopInviteBoopId: this.props.boop.id, boopInviteInviteeId: this.props.user.id, rsvp: reply, note: msg}});
    if(!!msg) {
      this.setState({responded: true});
    }
    const message = msg ? msg.trim() : msg;
    const newInvites = (this.props.boop.boop.invites.items || []).map((inv) => {
      if (inv.boopInviteInviteeId !== ownID) { return inv; }
      return {...inv, comment: message, response: reply, rsvp: reply}
    })
    var updatedBoop = {
      boop: {
        ...this.props.boop.boop, 
        invites: {
          ...this.props.invites,
          items: newInvites
        }
      }
    };
    this.setState({boop: updatedBoop});
    this.props.updateBoops(updatedBoop, reply);
    return updatedBoop;
  }

  getTitle(userIsHost, games) {
    const {boop, user} = this.props;
    // ownInvite ? "You invited " : `${boop.hostUser.preferredUsername} invited you to play League of Legends!`
    let gameNames = games.length > 1 ? games.slice(0, -1).join(", ") + " or " + games.slice(-1) : games;
    if(userIsHost) {
      if(boop.boop.invites.items.length == 1) {
        const other = this.props.boop.boop.invites.items.find((inv) => inv.invitee.id != user.id);
        return <Title>{`You invited ${other.invitee.preferredUsername} to play ${gameNames}`}</Title>;
      }
      else {
        return <Title>{`You invited ${boop.boop.invites.items.length} friends to play ${gameNames}`}</Title>;
      }
    }
    else {
      const hostUsername = this.props.boop.boop.hostUser.preferredUsername;
      const HostUser = <HostLink onPress={() => this.props.nav.navigate("PublicProfile", { id: this.props.boop.boop.hostUser.id, from: "Your Boops", name: hostUsername})}>{hostUsername}</HostLink>;//<TouchableOpacity onPress={() => {}}><HostLink>{hostUsername}</HostLink></TouchableOpacity>;
      if(boop.boop.invites.items.length == 1) {
        return <>{HostUser}<Title>{` invited you to play ${gameNames}`}</Title></>;
      } 
      if(boop.boop.invites.items.length == 2) {
        const other = this.props.boop.boop.invites.items.find((inv) => inv.invitee.id != user.id);
        return <>{HostUser}<Title>{` invited you and ${other.invitee.preferredUsername} to play ${gameNames}`}</Title></>;
      }
      else {
        return <>{HostUser}<Title>{` invited you and ${boop.boop.invites.items.length - 1} others to play ${gameNames}`}</Title></>;
      }
    }
  }
}

const UserInfo = styled.View`
  flex-direction: column;
`;
const Line = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;
const HostLink = styled.Text`
  color: ${COLORS.PRIMARY};
`;
const Title = styled.Text`
  font-weight: bold;
  flex-wrap: wrap;
  flex: 1;
  flex-shrink: 1;
  line-height: 18px;
  color: ${COLORS.DARK_GREY};
`;
const UsersContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 20px;
`;
const BoopUserContainer = styled.View`
  flex-direction: row;
  flex-basis: 50%;
  margin-bottom: 10px;
`;
const Content = styled.View`
  align-items: flex-start;
  flex-direction: column;
`;
const Boop = styled.View`
  border-radius: 15px;
  padding-vertical: 18px;
  padding-horizontal: 12px;
  background-color: white;
  margin-bottom: 10px;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.08);
`;
const TimeContainer = styled.View`

`;
const Time = styled.Text`
  font-family: 'montserrat-semibold';
  ${props => props.smaller ? `font-size: 14px;` : ""};
  color: ${props => props.now ? COLORS.RED : COLORS.DARK_GREY};
`;
const InviteSent = styled(Time)`
  font-family: 'montserrat';
  font-size: 12px;
`;
const RSVP = styled(InviteSent)`
  text-transform: capitalize;
`;
const ClockIcon = styled(Icon)`
  font-size: 18px;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  color: ${props => props.now ? COLORS.RED : COLORS.GREY};
`;