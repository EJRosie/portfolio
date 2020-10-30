import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, Text, View, Icon} from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';
import {TouchableOpacity, Image} from 'react-native';
import {Storage} from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import PickHeader from './pick-header';

export default class PickGame extends React.Component {

  render() {
    return (
      <PickContainer>
        <PickHeader 
          title={"Pick Games"}
          number={1}
        >
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <SearchText onPress={() => this.props.openDrawer()}>Search games</SearchText>
            <Icon style={{color: COLORS.PRIMARY, fontSize: 18, marginLeft: 5, alignSelf: "flex-end"}} name='search' />
          </TouchableOpacity>
        </PickHeader>
        <Middle horizontal={true} showsHorizontalScrollIndicator={false}>
          {
            this.props.games.map((game) => this.renderGame(game))
          }
        </Middle>
      </PickContainer>
    );
  }

  renderGame(game) {
    
    return (
      renderGame(game, this.props.chosenGames.includes(game.id), () => this.props.clickGame(game.id))
    );
  }
}

export const renderGame = (game, chosen=false, onClick=null) => {
  if(onClick == null) {
    return (
      <GameContainer disabld={!!onClick} active={chosen} key={game.slug}>
        {!!game.image ? <S3Image style={{width: 52, height: 64}} imgKey={game.image.thumbSmall.key} imgKey={game.image.thumbSmall.key.replace('public/', '')}/> : <GameImage source={require('../../../../assets/images/Anything.png')}/>}
        <GameName active={chosen} numberOfLines={2} >{game.forceShortTitle===true ? game.shortTitle : game.title }</GameName>
      </GameContainer>
    )
  }
  return (
    <TouchableOpacity onPress={() => onClick ? onClick(game.id) : {}}>
      <GameContainer disabld={!!onClick} active={chosen} key={game.slug}>
          {!!game.image ? <S3Image style={{width: 52, height: 64}} imgKey={game.image.thumbSmall.key} imgKey={game.image.thumbSmall.key.replace('public/', '')}/> : <GameImage source={require('../../../../assets/images/Anything.png')}/>}
          <GameName active={chosen} numberOfLines={2} >{game.forceShortTitle===true ? game.shortTitle : game.title }</GameName>
      </GameContainer>
    </TouchableOpacity>
  );
}
const GameContainer = styled.View`
  background: ${COLORS.WHITE};
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  width: 82px;
  height: 108px;
  padding: 8px;
  margin-right: 12px;
  align-items: center;
  justify-content: space-between;
  border-width: ${props => props.active ? "2px" : "0px"};
  border-color: ${COLORS.PRIMARY};
`;
const GameImage = styled.Image`
  width: 52px;
  height: 64px;
`;
const GameName = styled.Text`
  font-size: 10px;
  font-family: ${props => props.active ? "montserrat-bold" : "montserrat-light"};
  text-align: center;
  ${props => props.active ? `color: ${COLORS.PRIMARY}` : ""};

`;
const PickContainer = styled.View`
  margin-top: 10px;
  flex: 1;
`;
const Middle = styled.ScrollView`
  margin-top: 10px;
  padding-vertical: 10px;
`;
const SearchText = styled.Text`
  font-family: montserrat-light;
  text-decoration-line: underline;
  color: ${COLORS.PRIMARY};
`;