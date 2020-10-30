import React, { Fragment } from 'react';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { connect } from 'react-redux';

import * as Mutations from '../../../../graphql-custom/boops/mutations';
import * as FriendMutations from '../../../../graphql-custom/friends/mutations';
import * as ReportMutations from '../../../../graphql-custom/reports/mutations';
import * as CommentMutations from  '../../../../graphql-custom/comments/mutations';

import * as BlockMutations from '../../../../graphql-custom/blocks/mutations'

import Query from '../../../../api';
import { StackActions } from 'react-navigation';

import { TouchableWithoutFeedback, RefreshControl, KeyboardAvoidingView, Keyboard } from 'react-native';
import { COLORS } from '../../../../../native-base-theme/variables/material';
import { Container, Content, Body, Button, Icon, Text, View, Toast, Root, Input, Item } from 'native-base';
import BoopIcon from '../boop-icon';
var uuid = require('react-native-uuid');


export default class BoopCommentBar extends React.Component {
  render() {
    return (
        <InputItem regular>
          <Input 
            value={this.props.comment}
            placeholder='Leave a comment...'
            placeholderTextColor={COLORS.GREY}
            onChangeText={(text) => this.props.onChange(text)}
            onSubmitEditing={() => this.props.onSend()}
            returnKeyType="send"
          />
          <Button iconLeft transparent default onPress={() => this.props.onSend()}>
            <Icon style={{color: this.props.comment != "" ? COLORS.PRIMARY : COLORS.GREY}} active name='send' />
          </Button>
        </InputItem>
    );
  }
}

const InputItem = styled(Item)`
  border-radius: 5px;
  border-color: ${COLORS.GREY};
  padding-horizontal: 10px;
  height: 48px;
`;
