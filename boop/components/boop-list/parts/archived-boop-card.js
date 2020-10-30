import React, { Component } from 'react';
import {COLORS} from '../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';

import * as Mutations from '../../../graphql-custom/boops/mutations';
import Query from '../../../api';


import {TouchableOpacity} from 'react-native';
import { Card, Text, CardItem, Right, Icon, Body, Button, View } from 'native-base';
import BoopIcon from './boop-icon';
import ReplyButtons from './reply-buttons';
import Comments from './boop-card-comments';
export default class ArchivedBoopCard extends React.Component {
  state = {
    updateReply: false,
    responded: false,
    boop: this.props.boop
  }
  render() {
    //{gameNames.join(", ")}
    const { user} = this.props;
    const {boop} = this.state.boop;
    const gameNames = [];
    if(!boop) {
      return null;
    }
    
    (boop.games || {items: []}).items.map(gameObj => gameNames.push(gameObj.game.title));
    const ownInvite = boop.invites.items.find((inv) => inv.invitee.id == user.id);
    const isNow = moment().seconds(-900).milliseconds(0).toISOString() >= moment(boop.playtime).seconds(0).milliseconds(0).toISOString();
    return (
      <Boop>
        <TouchableOpacity onPress={() => this.onPress(boop)}>
        <Content>
            <Line>
              <BoopIcon status={"host"} user={boop.hostUser} self={boop.hostUser.id == user.id}/>
              <Title>{this.getTitle(boop.hostUser.id == user.id, gameNames)} </Title>
            </Line>

            <Line>
              <><ClockIcon type="FontAwesome5" name="clock" /><Time>{moment(boop.playtime).format("h:mm A")} </Time></>
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
                  </BoopUserContainer>
                ))
              }
            </UsersContainer>
            }
        </Content>
      </TouchableOpacity>
      { !!ownInvite && this.canAnswer() &&
        <ReplyButtons
          response={ownInvite.rsvp}
          updateReply={(reply, msg) => this.updateReply(reply, msg, ownInvite.boopInviteInviteeId)}
          pic={user}
        />
      }
      </Boop>
    );
  }
  canAnswer() {
    return moment(this.state.boop.boop.playtime).isAfter(moment().subtract(3, 'hours'));
  }
  onPress(boop) {
    this.props.openDrawer(boop);
  }
  updateReply(reply, msg, ownID) {
    Query(Mutations.updateBoopInvite, {input: {boopInviteBoopId: this.state.boop.boop.id, boopInviteInviteeId: this.props.user.id, rsvp: reply, note: msg}})
    // Query(Mutations.updateBoopInvite, {input: {boopInviteBoopId: this.props.boop.id, boopInviteInviteeId: this.props.user.id, rsvp: reply, note: msg}});
    if(!!msg) {
      this.setState({responded: true});
    }
    const message = msg ? msg.trim() : msg;
    const newInvites = (this.state.boop.boop.invites.items || []).map((inv) => {
      if (inv.boopInviteInviteeId !== ownID) { return inv; }
      return {...inv, comment: message, response: reply, rsvp: reply}
    })
    var updatedBoop = {
      boop: {
        ...this.state.boop.boop, 
        invites: {
          ...this.props.invites,
          items: newInvites
        }
      }
    };
    this.setState({boop: updatedBoop});
    this.props.updateBoops(updatedBoop,reply);
    return updatedBoop;
  }

  getTitle(userIsHost, games) {
    const {boop, user} = this.props;
    // ownInvite ? "You invited " : `${boop.hostUser.preferredUsername} invited you to play League of Legends!`
    let gameNames = games.length > 1 ? games.slice(0, -1).join(", ") + " or " + games.slice(-1) : games;
    if(userIsHost) {
      if(boop.boop.invites.items.length == 1) {
        const other = this.props.boop.boop.invites.items.find((inv) => inv.invitee.id != user.id);
        return `You invited ${other.invitee.preferredUsername} to play ${gameNames}`;
      }
      else {
        return `You invited ${boop.boop.invites.items.length} friends to play ${gameNames}`;
      }
    }
    else {
      const hostUser = this.props.boop.boop.hostUser.preferredUsername;
      if(boop.boop.invites.items.length == 1) {
        return `${hostUser} invited you to play ${gameNames}`;
      } 
      if(boop.boop.invites.items.length == 2) {
        const other = this.props.boop.boop.invites.items.find((inv) => inv.invitee.id != user.id);
        return `${hostUser} invited you and ${other.invitee.preferredUsername} to play ${gameNames}`;
      }
      else {
        return `${hostUser} invited you and ${boop.boop.invites.items.length - 1} others to play ${gameNames}`;
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
const Title = styled.Text`
  font-weight: bold;
  flex-wrap: wrap;
  flex: 1;
  flex-shrink: 1;
`;
const UsersContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;
const BoopUserContainer = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;
const Content = styled(CardItem)`
  align-items: flex-start;
  flex-direction: column;
  padding: 15px;
`;
const Boop = styled.View`
  border-radius: 5px;
  padding: 0px;
  background-color: white;
  margin-bottom: 10px;
  box-shadow: 2px 2px 2px black;
`;
const Time = styled.Text`
  font-family: 'montserrat-semibold';
  ${props => props.smaller ? `font-size: 14px;` : ""};
  color: ${props => props.now ? COLORS.RED : COLORS.GREY};
`;
const ClockIcon = styled(Icon)`
  font-size: 18px;
  width: 18px;
  height: 18px;
  margin-right: 5px;
  color: ${props => props.now ? COLORS.RED : COLORS.GREY};
`;