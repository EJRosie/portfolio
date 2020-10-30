import Link from "next/link";
import { Component } from "react";
import { ComponentClass } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import config from '../../../config/common';
import assembleAction from "../../../lib/actions";
import styled from "styled-components";
import LiveBadge from "../../common/cards/series/live-badge";
import Countdown from "../../common/countdown";
import {IEvent} from '../../../lib/api/models/events.ts';
import Col from "react-bootstrap/lib/Col";
import { IFullTournament } from "../../../lib/api/models/tournament";
import {Stylesheet} from '../../common/styles';
import FavoriteThing from "../../common/favorite-thing";
import favoriteTournament from "../../../lib/actions/creators/user/favorite-tournament";
import unfavoriteTournament from "../../../lib/actions/creators/user/unfavorite-tournament";
import AuthActions, {
  AuthModalSection,
  IToggleAuthModal,
} from "../../../lib/actions/auth";


const InfoContainer = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 5px;
  min-height: 70px;
  background-color: ${props => props.theme.backgroundColors.card.main};
`;

const StyledLiveBadge = styled(LiveBadge)`
  position: absolute !important;
  top: 10px;
  left: 10px;
`;

const FavoriteButton = styled.div`
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TournamentBottomBar = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;

const TournamentContainer = styled(Col)`
  width: calc(100% - 15px);
  @media ${config.devices.sm} {
    width: calc(50% - 15px);
  }
  @media ${config.devices.lg} {
    width: calc(33% - 15px);
  }
  padding: 0;
  margin-bottom: 30px;
  cursor: pointer;
  &:hover {
    ${InfoContainer} {
      transition: ${props => props.theme.transitions.cardHover};
      background: ${props => props.theme.backgroundColors.card.hover};
    }
  }
`;
function statusToColor(status: string): string {
  switch (status) {
    case "completed":
      return "#40b259";
    case "ongoing":
      return "#ef3e36";
    default:
      return "inherit";
  }
}

interface IHomeProps {
  squareLogo: string;
  token: string | boolean;
  live: boolean | false;
  status: string | Element;
  title: string;
  gameLogo: string;
  gameTitle: string;
  prizeMoney: string;
  tournamentId: number;
  tournament: IEvent;
}

interface IStateProps {
  events: IEvent[];
  favoriteGames: number[];
  location: any;
  token: string | boolean;
}

interface ILocalState {
  rendered: boolean;
}

interface IDispatchProps {
  onFavorite: (tournament: IFullTournament, token: string | boolean) => void;
  onUnfavorite: (id: number, token: string | boolean) => void;
}

type IOwnProps = IHomeProps & IStateProps & IDispatchProps;

class EventCard extends Component<IOwnProps, ILocalState> {
  public static defaultProps = {
    live: false,
  };

  public render() {
    const tournament = this.props.tournament;
    return (
      <Link
        href={{
          pathname: "/tournament",
          query: { id: this.props.tournamentId },
        }}
        as={`/tournament/${this.props.tournamentId}`}
        title={`/tournament/${this.props.tournamentId}`}
        prefetch
      >
      <TournamentContainer xs={6} md={4}>
        <div style={Stylesheet.tournamentImageContainer} style={{backgroundImage: tournament.images.default}}>
          {tournament.is_live &&  <StyledLiveBadge/> }
          <FavoriteButton>
            <FavoriteThing
              style={{padding: "5px 15px"}}
              favorited={this.props.tournament.favorite}
              token={this.props.token}
              onFavorite={this.favorite}
              onUnfavorite={this.unfavorite}
            />
            </FavoriteButton>
          <img style={Stylesheet.tournamentImage} src={tournament.images.default}/>
        </div>
        <InfoContainer>
            <div style={Stylesheet.tournamentNameContainer}>
              <img style={Stylesheet.tournamentGameLogo} src={this.props.gameLogo}/>
              <h6 style={Stylesheet.tournamentName}> {this.props.title} </h6>
            </div>
            <TournamentBottomBar style={Stylesheet.tournamentTime}>
              <h6 style={Stylesheet.tournamentPrize}> {this.props.tournament.prizepool.total || " "} </h6>
              {this.props.status}
            </TournamentBottomBar>
          </InfoContainer>
          
      </TournamentContainer>
      </Link>
    );
  }

  private favorite = () => {
    const { tournament, token, onFavorite } = this.props;
    onFavorite(tournament, token);
  };

  private unfavorite = () => {
    const { tournament, token, onUnfavorite } = this.props;
    onUnfavorite(tournament.id, token);
  };
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    favoriteGames: state.user.favoriteGames.ids || [],
    games: state.content.games,
    location: state.app.location,
    token: state.auth.token,
    events: state.home.events,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const showSignUpModal = () => {
    dispatch(
      assembleAction<IToggleAuthModal>(AuthActions.ToggleAuthModal, {
        section: AuthModalSection.SignUp,
        show: true,
      })
    );
  };
  return {
    onFavorite: (tournament: IFullTournament, token: string | boolean) => {
      if (!token) {
        return showSignUpModal();
      }
      if(token) { favoriteTournament(tournament.id, token, dispatch); }
    },

    onUnfavorite: (id: number, token: string | boolean) => {
      unfavoriteTournament(id, token, dispatch);
    },
  };
};

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(EventCard);
