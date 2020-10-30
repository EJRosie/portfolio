import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../../../../native-base-theme/variables/material';
import { Button, Text} from 'native-base';
import {View, Image} from 'react-native';
import { S3Image } from 'aws-amplify-react-native';
import {Storage} from 'aws-amplify';


export default class searchedGame extends React.Component {
  state = {
    selected: false,
    image: null
  }
  componentDidMount() {
    if(!!this.props.game.image) {
      Storage.get(this.props.game.image.thumbSmall.key, {level: 'public'}).then(res => this.setState({image: res}));
    }
  }
  render() {
    return (
      <SingleUserCard>
        {!!this.props.game.image ? <S3Image style={{width: 32, height: 32}} 
        imgKey={this.props.game.image.thumbSmall.key} imgKey={this.props.game.image.thumbSmall.key.replace('public/', '')}/>
          : <UserImage source={require('../../../../assets/images/Anything.png')}/>}
        <Username selected={this.state.selected}>{this.props.game.forceShortTitle===true ? this.props.game.shortTitle : this.props.game.title || "Game"}</Username>
        <ActionButton rounded primary bordered={!this.state.selected} onPress={() => this.select()}><Text>{`Select${this.state.selected ? "ed" : ""}`}</Text></ActionButton>
      </SingleUserCard>
    );
  }
  select() {
    this.setState({selected: !this.state.selected});
    this.props.onSelect();
  }
}
const UserImage = styled.Image`
  width: 32px;
  height: 32px;
`;
const ActionButton = styled(Button)`
  padding-horizontal: 10px;
  width: 106px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;
const Username = styled.Text`
  flex: 1;
  font-family: montserrat;
  font-size: 14px;
  margin-horizontal: 12px;
  color: ${props => props.selected ? COLORS.PRIMARY : COLORS.DARK_GREY};
`;
const SingleUserCard = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;