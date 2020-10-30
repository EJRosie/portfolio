import React, { Component } from 'react';
import {COLORS} from '../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import Query from '../../../api';
import * as Queries from  '../../../graphql-custom/comments/queries';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as Subscriptions from '../../../graphql-custom/comments/subscriptions';
import CommentList from './comment-parts/comment-list';
import { connect } from "react-redux";
var uuid = require('react-native-uuid');

class BoopCardComments extends React.Component {
  state = {
    comments: [],
    reply: "",
    lastAdded: null
  }
  _commentSubscription;
  componentDidMount = () => {
    if(this.props.full) {
      Query(Queries.boopCommentsByBoopId, {boopCommentBoopId: this.props.boop.id, sortDirection: "DESC", limit: 20}).then((res) => {
        this.setState({comments: res.data.boopCommentsByBoopId.items.reverse(), next: res.data.boopCommentsByBoopId.nexttoken});
      });
    }
    else {
      this.setState({comments: (this.props.boop.comments || {items: []}).items.reverse() || []});
    }
    this._commentSubscription = API.graphql(
      graphqlOperation(Subscriptions.onCreateBoopComment, {boopCommentBoopId: this.props.boop.id})
    ).subscribe({
        next: (newComment) => {
          if(newComment.value.data.onCreateBoopComment.id == this.state.lastAdded) {return;}
          this.setState({comments: [...this.state.comments, newComment.value.data.onCreateBoopComment], lastAdded: newComment.value.data.onCreateBoopComment.id});
        }
    });
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.newComment != prevProps.newComment) {
      this.setState({
        comments: [...this.state.comments, this.props.newComment],
        lastAdded: this.props.newComment.id
      });
    } else if(this.props !== prevProps){
      if(!this.props.full){
        Query(Queries.boopCommentsByBoopId, {boopCommentBoopId: this.props.boop.id, sortDirection: "DESC", limit: 2}).then((res) => {
          this.setState({comments: res.data.boopCommentsByBoopId.items.reverse(), next: res.data.boopCommentsByBoopId.nexttoken});
        });
      }
    }
  }

  componentWillUnmount() {
    // if(!this.props.full) {
    this._commentSubscription.unsubscribe();
    // }
  }

  render() {
    const comments = this.props.full ? this.state.comments : this.state.comments.slice(-2);
    return (
      <CommentsContainer full={!!this.props.full}>
       <ListContainer>
        <CommentList comments={comments} user={this.props.user} host={this.props.boop.hostUser}/>
       </ListContainer>
      </CommentsContainer>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
)(BoopCardComments);

const CommentsContainer = styled.View`
  padding-bottom: 14px;
  padding-top: 18px;
`;
const ListContainer = styled.View`
  flex: 1;
`;


/*
<ReplyBar>
  <Item regular>
    <Input 
      value={this.state.reply} 
      placeholder='Leave a comment' 
      placeholderTextColor={COLORS.GREY}
      onChangeText={(text) => this.setState({reply: text})}
      onSubmitEditing={() => this.sendComment()}
      returnKeyType="send"
    />
    <Button iconLeft transparent default onPress={() => this.sendComment()}>
      <Icon style={{color: COLORS.PRIMARY, paddingRight: 2}} active name='send' />
    </Button>
  </Item>
</ReplyBar>
*/