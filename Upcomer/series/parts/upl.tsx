import { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import api from "../../../lib/api";
import { IPlayer, ITeam } from "../../../lib/api/models/roster";
import { ISeriesDetail } from "../../../lib/api/models/series";
import { IResponse as IPredictionGetResponse } from "../../../lib/api/prediction/get";
import { IState } from "../../../lib/state";
import assembleAction from "../../../lib/actions";
import AuthActions, {
  AuthModalSection,
  IToggleAuthModal,
} from "../../../lib/actions/auth";

// UI
import {
  renderCompetitor,
  UPLContainer,
  UPLTitleBar,
  UPLButton,
  UPLBarResults,
  UPLBarContainer,
  UPLBarInfo,
  UPLTeamName
} from './components'


interface IDispatchProps {
  onShowSignUp: () => void;
}

interface IStateProps {
  guest: boolean;
  token: string | boolean;
}

interface IOwnProps {
  series: ISeriesDetail;
}

type IProps = IStateProps & IOwnProps & IDispatchProps;

interface IOwnState {
  loading: boolean;
  response: IPredictionGetResponse | null;
}

function getTeam(
  series: ISeriesDetail,
  seedingKey: string,
  votes: number,
  voted: boolean
): {
  icon: string;
  name: string;
  votes: number;
  voted: boolean;
  seedingKey: string;
  entityType: string;
  entityId: number;
} {
  // Placeholders
  if (series.rosters.length < 2) {
    return {
      entityId: 0,
      entityType: "team",
      icon: "placeholder",
      name: "TBD",
      seedingKey: "",
      voted,
      votes: 0,
    };
  }
  const roster =
    series.rosters[0].seeding_key === seedingKey
      ? series.rosters[0]
      : series.rosters[1];
  if ((roster.teams || []).length) {
    const teams = roster.teams as ITeam[];
    return {
      entityId: teams[0].id || teams[0].team_id,
      entityType: "team",
      icon: teams[0].images.fallback ? "placeholder" : teams[0].images.default,
      name: teams[0].name,
      seedingKey: roster.seeding_key,
      voted,
      votes,
    };
  } else {
    const players = roster.players as IPlayer[];
    return {
      entityId: players[0].id || players[0].player_id,
      entityType: "player",
      icon: players[0].images.default,
      name: players[0].nick_name,
      seedingKey: roster.seeding_key,
      voted,
      votes,
    };
  }
}

function getInfo(response: IPredictionGetResponse, series: ISeriesDetail) {
  return [
      getTeam(
        series,
        "1",
        response.votes["1"].count || 0,
        String(response.userPredictedSeedingKey) === "1"
      ),
      getTeam(
        series,
        "2",
        response.votes["2"].count || 0,
        String(response.userPredictedSeedingKey) === "2"
      ),
    ];
}

class Predictions extends Component<IProps, IOwnState> {
  public state: IOwnState = {
    loading: true,
    response: null,
  };

  public componentDidCatch(error: Error | null, info: object) {
     /* tslint:disable-next-line */
     console.log(error);
     return(
       <div></div>
     )
  }

  public componentDidMount() {
    this.getPredictions();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.guest !== this.props.guest ||
      prevProps.series.id !== this.props.series.id
    ) {
      this.getPredictions();
    }
  }

  public render() {
    // Don't render when loading
    if (this.state.loading || !this.state.response) {
      return false;
    }
    const {response} = this.state;
    const series = this.props.series;
    const teams = getInfo(response, this.props.series);

    const teamZeroWon = (series.scores[series.seeding[teams[0].seedingKey]] > series.scores[series.seeding[teams[1].seedingKey]]);
    const teamZeroColored = series.complete ? teamZeroWon : (teams[0].seedingKey === response.userPredictedSeedingKey);

    return (
      <UPLContainer>
        <UPLTitleBar>
          Who Will Win? <span>{response.votes.totalVotes} Votes</span>
        </UPLTitleBar>
        {response.allowedPredicting ? 
          <>
            <UPLButton onClick={() => this.voteFor(teams[0].seedingKey)} icon={teams[0].entityType === "team" && teams[0].icon}>
              {teams[0].name}
            </UPLButton>
            <UPLButton onClick={() => this.voteFor(teams[1].seedingKey)} icon={teams[1].entityType === "team" && teams[1].icon}>
              {teams[1].name}
            </UPLButton>
          </>
        :
        <>
          <UPLBarResults>
            {renderCompetitor(teams[0])}
            <UPLBarInfo>
              <p>
                <UPLTeamName winner={(!series.complete || teamZeroWon)}>{teams[0].name}{response.userPredictedSeedingKey === "1" && <> <i className="fas fa-caret-left"></i> <span>Your Pick</span> </>}</UPLTeamName>
                <UPLTeamName winner={(!series.complete || !teamZeroWon)}>{teams[1].name}{response.userPredictedSeedingKey === "2" && <> <i className="fas fa-caret-right"></i> <span>Your Pick</span> </>}</UPLTeamName>
              </p>
              <UPLBarContainer leftColor={teamZeroColored} split={response.votes[1].percentage}>
                <div></div>
              </UPLBarContainer>
              <p>
                <span>{Math.round(response.votes[1].percentage)}%</span>
                <span>{Math.round(response.votes[2].percentage)}%</span>
              </p>
            </UPLBarInfo>
            {renderCompetitor(teams[1])}
          </UPLBarResults>
        </>}
      </UPLContainer>
    );
  }


  private voteFor = (voteID: string) => {
    if (!this.props.token) {
      this.props.onShowSignUp();
    } else {
      api.prediction.save
        .perform({
          id: this.props.series.id,
          seedingKey: voteID,
          token: this.props.token as string,
        })
        .then((response) => {
          this.setState({response})
        })
        .catch(e => {
          // TODO handle error
        });
    }
  };

  private getPredictions() {
    this.setState({ loading: true });
    api.prediction.get
      .perform({ id: this.props.series.id, token: this.props.token as string })
      .then(response => {
        this.setState({
          loading: false,
          response,
        });
      })
      .catch(e => {
        // TODO handle error
      });
  }
}

const mapStateToProps = (state: IState): IStateProps => ({
  guest: !state.auth.token,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  onShowSignUp: () => {
    dispatch(
      assembleAction<IToggleAuthModal>(AuthActions.ToggleAuthModal, {
        section: AuthModalSection.SignUp,
        show: true,
      })
    );
  },
});

export default connect<IStateProps, {}, IOwnProps>(mapStateToProps, mapDispatchToProps)(
  Predictions
);
