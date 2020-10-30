import * as React from "react";
import Router from 'next/router';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IState } from "../../lib/state";
import { ITournamentSeries, ISeriesDetail } from "../../lib/api/models/matches";
import { getGameById } from "../../lib/server/content/games";

// UI 
import TournamentCard from '../common/cards/matches/tournament';
import LiveMatchCard from '../common/cards/matches/live';


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
  tournaments: ITournamentSeries[];
  liveMatches: ISeriesDetail[];
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
        {this.props.liveMatches.length > 0 &&
          <>
            <Title>
              <img src={require("../../static/images/SVG/live-dot.svg")}/> Featured Live Matches
            </Title>
            {this.props.liveMatches.map((match) => (
              <LiveMatchCard key={match.id} match={match}/>
            ))}
          </>
        }
        <Title>
          Match Schedule
        </Title>
        {this.props.tournaments.map((tournament) => (
          <TournamentCard tournament={tournament} />
        ))}
        <a href={`/${getGameById(this.props.currentGame).slug}/matches`}> <SeeAllButton>See All Matches</SeeAllButton> </a>
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
    tournaments: state.home.homeMatches.matches,
    liveMatches: state.home.liveSeries.series || [],
  };
};

export default connect<IStateProps>(
  mapStateToProps,
)(Home);
