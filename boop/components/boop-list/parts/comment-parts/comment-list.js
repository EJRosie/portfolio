import React, { Component } from 'react';
import styled from 'styled-components';
import CommentCard from './boop-comment';
import BoopIcon from '../boop-icon';
import {COLORS} from '../../../../../native-base-theme/variables/material';

export default class BoopCommentList extends React.Component {
  render() {
    const comments = this.props.comments;
    if (comments.length < 1) {
      return (
        <NoComments>There are no comments yet.</NoComments>
      );
    }
    return (
      <>
      {comments.map((msg) => 
        <CommentCard key={msg.id} comment={msg}>
          <BoopIcon self={msg.user.id == this.props.user.id} user={msg.user} status={msg.user.rsvp} host={msg.user.id == this.props.host.id}/> 
        </CommentCard>
      )}
      </>
    );
  }
}

const NoComments = styled.Text`
  color: ${COLORS.DARK_GREY};
  font-family: 'montserrat-light';
`;
