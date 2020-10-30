import React, { Component } from 'react';
import {COLORS} from '../../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import { Card, Text, CardItem, Right, Item, Input, Icon, Button, View } from 'native-base';

export default class CommentCard extends React.Component {
  
  render() {
    return (
      <Container style={{marginBottom: 10}}>
        {this.props.children}
        <CommentContainer>
          <CommentInformation><Bold>{this.props.comment.user.preferredUsername}</Bold> {moment(this.props.comment.createdAt).fromNow()}</CommentInformation>
          <CommentText>{this.props.comment.text}</CommentText>
        </CommentContainer>
      </Container>
    );
  }
}
const Bold = styled.Text`
  font-weight: bold;
  font-family: montserrat-bold;
  color: ${COLORS.DARK_GREY};
  margin-right: 18px;
  padding-right: 100px;
`;
const CommentInformation = styled.Text`
  font-size: 14px;
  margin-bottom: 4px;
  color: ${COLORS.DARK_GREY};
  font-family: montserrat-light;
`;
const CommentText = styled.Text`
  font-size: 14px;
  font-family: montserrat-light;
  color: ${COLORS.DARK_GREY};
`;
const Container = styled.View`
  margin-left: 16px;
  flex-direction: row;
  align-items: center;
`;
const CommentContainer = styled.View`
  flex: 1;
  padding-top: 2px;

`;