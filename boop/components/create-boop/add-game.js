import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Keyboard } from 'react-native';
import {COLORS} from '../../../native-base-theme/variables/material';
import * as Queries from '../../graphql-custom/search/queries';
import Query from '../../api';
import { Container, Content, Body, Button, Icon, Input, List, ListItem} from 'native-base';
import Item from './parts/searched-game';
import Header from '../common/header';
import { StackActions } from 'react-navigation';

export default class AddGames extends React.Component {
  state = {
    results: [],
    inputText: "",
  }
  componentDidMount(){
    //  this.game_input._root.focus();
  }

  render() {
    const { params} = this.props.navigation.state;
    return (
      <Container>
        <Header 
          leftButton={
            <Button transparent onPress={() => {this.navigateToNewBoop()}}>
              <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
            </Button>
          }
          title={"Search for game"}
        />
        <Content>
          <List itemDivider={false} style={{padding: 24}}>
            <InputBox noIndent>
            <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="search"
                
              />
              <StyledInput ref="game_search_input" 
              ref={(ref) => { this.game_input = ref; }} 
              autoFocus={true}
              value={this.state.inputText}
              onChangeText={(text) => this.onTextChange(text)} placeholder={"Search by name"}/>
              {this.state.inputText!="" &&
              <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="times-circle"
                onPress={()=>this.setState({inputText:""})}
              />
      }
            </InputBox>
            <ResultsStatement>
              {this.state.inputText != "" && (this.state.results.length == 0 ? "No Search Results" : "Search Results")}
            </ResultsStatement>
              {
                this.state.results.map((game) => (
                  <Game noBorder key={game.id + " item"} noIndent>
                    <Item key={game.id} gameTitle={game.title} game={game}
                      onSelect={() => params.addGame(game)}
                     />
                  </Game>
                ))
              }
          </List>
        </Content>
      </Container>
    );
  }

  navigateToNewBoop = () => {
    popAction = StackActions.pop({ n: 1 });
    this.props.navigation.dispatch(popAction);
  }

  onTextChange = (text) => {
    this.setState({inputText: text})
    const regText = text.replace(" ", "-");
    
    Query(Queries.searchGames, {filter: {title: {matchPhrasePrefix: `.*${text.toLowerCase()}.*`}}, 
    sort: {
        field: "popularity", 
        direction: "desc"
    }})
    .then((res) => {
      this.setState({results: res.data.searchGames.items});
    });
  }
}

const StyledInput= styled(Input)`

`;
const Game = styled(ListItem)`
  padding: 0px;
  margin-vertical: 12px;
  border-width: 0px;
`;
const ResultsStatement = styled.Text`
  font-family: montserrat-light;
  font-size: 12px;
  color: ${COLORS.DARK_GREY};
`;
const InputBox = styled.View`
  margin-bottom: 18px;
  padding: 8px;
  border-width: 1px;
  border-color: ${COLORS.GREY};
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  flex: 1;
  height: 48px;
`;