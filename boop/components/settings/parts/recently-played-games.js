import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "../../../../native-base-theme/variables/material";
import { List, ListItem, View, Left, Right, Text } from "native-base";
import { S3Image } from 'aws-amplify-react-native';
import {renderGame} from '../../create-boop/parts/pick-game';


const GameList = (props) => {
  return (
    <GameListList horizontal={true}>
      {
        props.games.map((item, i) => (
          renderGame(item, false)
        ))
      }
    </GameListList>
  )
}


export default class RecentlyPlayedGames extends React.Component {

  render() {
    const games = this.props.games;
    return (
      <Container>
        <ListItem style={{borderBottomWidth: 0}}>
          <Text style={{color: "#813AC2", fontFamily: 'montserrat-semibold'}}>Recently Played Games</Text>
        </ListItem>
        {
          games.length > 0 ?
          <GameList games={games.slice(0, 4)}/>
          :
          <Text style={{color: "rgba(0, 0, 0, 0.6)", fontFamily: 'montserrat', fontSize: 16, textAlign: "center"}}>No games played yet.</Text>
        }

      </Container>
    );
  }
}

const Container = styled.View`
  width: ${wp('100%')};
`;

const GameImage = styled.Image`
  width: 52;
  height: 64;
`;

const GameTitle = styled.Text`
  font-family: montserrat;
  font-size: 10px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 5px;
`;

const GameListItem = styled(ListItem)`
  width: ${wp('19.25%')};
  height: ${wp('25.21%')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-width: 0.5px;
  border-radius: 10px;
  background-color: #ffffff;
  margin-horizontal: 0;
  padding: 0;
  margin-vertical: 8px;
  elevation: 3;
`;

const GameListList = styled(List)`
  display: flex;
  flex-direction: row;
  padding: 0;
`;
