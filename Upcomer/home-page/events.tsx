import * as React from "react";
import Router from 'next/router';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IState } from "../../lib/state";
import { getGameById } from "../../lib/server/content/games";
import IEventsModel from "../../lib/api/models/events";


// UI 
import GameContainer from '../common/cards/tournaments/game';


const Container = styled.div``;
const Title = styled.h2`
  font-size: 24px;
  line-height: 27px;
  font-family: ${props => props.theme.fonts.secondary};
  color: ${props => props.theme.colors.whiteTrue};
`;
const SeeAllButton = styled.button`
  width: 100%;
  border: none;
  background: ${props => props.theme.colors.blue};
  color: ${props => props.theme.colors.whiteTrue};
  &:hover {
    opacity: 0.7;
  }
  border-radius: 5px;
`;


interface IStateProps {
  gameIds: number[],
  currentGame: number,
  location: any;
  token: string | boolean;
  tournaments: {
    [id: string]: IEventsModel[];
  };
}

interface ILocalState {
  rendered: boolean;
}

type IOwnProps = IStateProps;

class Home extends React.PureComponent<IOwnProps, ILocalState> {
  public state: ILocalState = {
    rendered: false,
  };

  public render() {
    return (
      <Container>
        {Object.keys(this.props.tournaments).length > 0 &&
          <>
          <Title>
            Tournaments
          </Title>
          {Object.keys(this.props.tournaments).map((game) => (
            <GameContainer gameID={Number(game)} tournaments={this.props.tournaments[game]} />
          ))}
          <a href={`/${getGameById(this.props.currentGame).slug}/tournaments`}> <SeeAllButton>See All Tournaments</SeeAllButton> </a>
          </>
        }
      </Container>
    );
  }

}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    gameIds: state.home.navMenu.currentGame === -2 ? [] :  state.home.navMenu.currentGame === -1 ? state.user.favoriteGames.ids  || [] : [state.home.navMenu.currentGame],
    currentGame: state.home.navMenu.currentGame,
    location: state.app.location,
    token: state.auth.token,
    tournaments: state.home.events.events || {},
  };
};

export default connect<IStateProps>(
  mapStateToProps,
)(Home);
