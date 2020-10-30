import { connect } from "react-redux";
import React, { Component, Fragment } from "react";
import api from '../../lib/api';
import { IPlayer, ITeam } from "../../lib/api/models/roster";
import { ISeriesDetail, ISessionStatus } from "../../lib/api/models/series";
import { getGameByAbiosId } from "../../lib/server/content/games";
import { IState } from "../../lib/state";
import { IBasicGame } from "../../lib/api/models/game";
import CommunicationPanel from "../communication";
import SeriesDetailSEO from '../seo/series';
import {slugify} from '../../lib/seo/slug';
import {RibbonIcon} from "../common/icons/games";


import SeriesHeader from './parts/series-header';
import UPL from './parts/upl';
import PreviousMeetings from './parts/previous-meetings';
import LatestResults from './parts/latest-results';
import Roster from './parts/roster';
import Brackets from "../brackets";
import Stats from '../stats';
import Vods from './parts/vods';
import Streams from './parts/streams';
import {
  Container,
  Column,
  CommentsContainer,
  TournamentHeader,
  Separator,
  MatchupInfo,
  RostersContainer,
  RosterBar,
  MobileRosterBar,
  TeamIcon,
  TheaterModeCover,
  ShowTheaterModeButton,
  PaddingBlock
} from './parts/components';
  


interface IStateProps {
  hideResults: boolean;
  token: boolean | string;
}
interface ILocalProps {
  series: ISeriesDetail;
  game: IBasicGame
}
type IProps = IStateProps & ILocalProps;

class SeriesDetail extends Component<IProps, {showResult: boolean, theaterMode: boolean}> {
  public state = {
    showResult: false,
    theaterMode: false
  }
  public render() {
    const {series, game} = this.props;
    const competitors = getTeams(series);
    let disableComments = {
      post: false,
      pre: false,
    };

    // Close out comments if there are lesser than 2 competitors or response specifies closed.
    if (series) {
      disableComments = {
        post: this.isClosed(series, "post-series"),
        pre: this.isClosed(series, "pre-series"),
      };
    }
    const stages = series ? series.stages : [];
    const selectedSubstage = stages.length ? series.substage : null;
    return (
      <Container>
        {this.state.theaterMode && <TheaterModeCover></TheaterModeCover>}
        <SeriesDetailSEO series={this.props.series} teams={competitors}/>
        <Column xs={12} md={8}>
          <TournamentHeader href={`/${game.slug}/tournament/${series.tournament_id}/${slugify(series.tournament.title)}`} gameID={game.game_id}>
            <RibbonIcon game={game.game_id.toString()} color={"#fff"} height={18} width={18} />
            {series.tournament.title} • {series.substage.title} <i className="fas fa-chevron-right"></i>
          </TournamentHeader>
          <Separator></Separator>
          {series.is_live && <Streams theaterMode={this.state.theaterMode} toggleTheaterMode={this.toggleTheaterMode} streams={series.streams}/>}
          <SeriesHeader 
            showScore={series.reveal_results || this.state.showResult}
            unSpoil={this.handleClick}
            highlight={series.highlight}
            start={series.start}
            scores={series.scores}
            is_live={series.is_live}
            completed={series.complete}
            bestof={series.bestOf}
            competitors={competitors}
          />
          {series.complete && <Vods videos={series.videos}/>}
          <UPL
            series = {series}
          />
            <Stats
              matchIDs={this.props.series.matches.map((match) => match.id)}
              matches={this.props.series.matches}
              series={this.props.series}
              teams={competitors}
              game={this.props.series["play-by-play"] ? series.game.id : -1}
              nostats={
                <Fragment>

                {series && series.rosters.length > 0 && series.rosters[0].teams !== null &&
                  <>
                  <RosterBar>
                    {series.rosters[0] && <h3> {<TeamIcon imgSrc={series.rosters[0].teams[0].images.thumbnail}/>} Roster</h3>}
                    {series.rosters[1] && <h3> {<TeamIcon imgSrc={series.rosters[1].teams[0].images.thumbnail}/>} Roster</h3>}
                  </RosterBar>
                  <MobileRosterBar><h3>Roster</h3></MobileRosterBar>
                  <RostersContainer>
                {series.rosters[0] && <Roster roster={series.rosters[0]} gameSlug={game.slug}/> }
                {series.rosters[1] && <Roster roster={series.rosters[1]} gameSlug={game.slug}/> }
                  </RostersContainer>
                  </>
                }
                <MatchupInfo>
                {series && series.rosters.length > 1 &&
                  <PreviousMeetings 
                    competitors={competitors}
                    previousMeetings={series.performance.head_to_head}
                    previousMatches={getPreviousMeetings(competitors, series)}
                  />
                }
                {series && series.rosters.length > 0 &&
                  <LatestResults 
                    competitors={competitors}
                    previousMeetings={series.performance.head_to_head}
                    latestResults={series.performance.web_form}
                    gameSlug={game.slug}
                  />
                }
                </MatchupInfo>
                </Fragment>
              }
            />
          {series && series.stages.length > 0 &&
            <Brackets
              tournament={series.tournament}
              stages={stages}
              substage={selectedSubstage}
              defaultSubstage={series.substage_id}
              defaultStage={(series.substage || {}).stage_id}
            /> 
          }
          {series.is_live ? 
              <ShowTheaterModeButton onClick={this.toggleTheaterMode}><span>Join Chat</span> <span> <i className={"fas fa-comments-alt"}></i> {series.chat_rooms[0].total_user_count} Chatting </span></ShowTheaterModeButton> 
            :
              <ShowTheaterModeButton as="a" href={"#comments"}><span>Discuss this Match</span> <span> <i className={"fas fa-comment-alt"}></i> {series.comments.total_count} Comment{series.comments.total_count !== 1 && "s"} <i className="fas fa-chevron-down"></i></span></ShowTheaterModeButton>
          }
        </Column>
        <CommentsContainer xs={12} md={4} id={"comments"} theaterMode={this.state.theaterMode}>
            <CommunicationPanel
              id={series.id}
              key={series.id}
              type={"series"}
              chatRooms={series.chat_rooms}
              commentStats={{
                closedReasons:
                  series.comments.session_status.closed_reasons,
                disable: disableComments,
                totalCount: series.comments.total_count,
                matchStatus: series.complete,
              }}
            />
        </CommentsContainer>
      </Container>
    )
  }

  private toggleTheaterMode = () => {
    this.setState({theaterMode: !this.state.theaterMode});
  }
  private isClosed(object: ISeriesDetail, key: string): boolean {
    return (
      object.comments.session_status[key as keyof ISessionStatus] === "closed"
    );
  }

  private handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ showResult: true });
    if (this.props.token) {
      api.esports.series.revealResults
        .perform({
          id: this.props.series.id,
          token: this.props.token as string,
        })
    }
    return false;
  };

}


const mapStateToProps = (state: IState): IStateProps => {
  return {
    hideResults: !state.user.profile.showResults,
    token: state.auth.token,
  };
};

export default connect<IStateProps>(
  mapStateToProps,
)(SeriesDetail);




interface ICompetitor {
  id: number;
  name: string;
  shortName: string;
  key: string;
  icon: string;
  entityId: number;
  entityType: string;
  link?: string;
}

function getTeams( series: ISeriesDetail | void ): ICompetitor[] | null {
  let teams = [];
  teams = [
      { id: 0, entityType: "team", icon: "placeholder", name: "TBD", shortName: "TBD"},
      { id: 0, entityType: "team", icon: "placeholder", name: "TBD", shortName: "TBD"}
    ];
  const game = getGameByAbiosId(series.game.id)
  series.rosters.map((roster, index) => {
    if ((roster.teams || []).length) {
      const team = roster.teams;
      teams[index] = {
        entityId: team[0].id || team[0].team_id,
        id: roster.id,
        entityType: "team",
        icon: team[0].images.default,
        name: team[0].name,
        key: roster.seeding_key,
        shortName: team[0].short_name,
        gameSlug: game.slug,
        link: `/${game.slug}/team/${team[0].id || team[0].team_id}/${slugify(team[0].name)}`
      };
    } else if((roster.players || []).length) {
      const player = roster.players;
      teams[index] = {
        entityId: player[0].id || player[0].player_id,
        id: roster.id,
        entityType: "player",
        icon: player[0].images.default,
        name: player[0].nick_name,
        shortName: player[0].nick_name,
        gameSlug: game.slug,
        link: `/${game.slug}/player/${player[0].id || player[0].player_id}/${slugify(player[0].nick_name)}`
      };
    }
    else {
      teams[index] = {
        id: 0,
        entityType: "team",
        icon: "placeholder",
        name: "TBD",
        shortName: "TBD"
      }
    }
  });
  return teams;
}


function getPreviousMeetings(teams: any, series: ISeriesDetail) {
  return {
    matches: series.performance.past_encounters.map(match => {
      // Get scores
      const scores: { [id: number]: number } = {};
      match.rosters.forEach(roster => {
        scores[roster.id] = roster.score;
      });

      return {
        date: match.start ? new Date(match.start) : new Date(),
        score: {
          teamOne: scores[match.rosters[0].id],
          teamTwo: scores[match.rosters[1].id],
        },
        series_id: match.id,
        tournament: {
          icon: series.game.upcomer_images.default,
          id: match.tournament_id,
          name: match.tournament_title,
        },
      };
    }),
    teamOne: {
      ...teams[0],
      wins: series.performance.head_to_head[teams[0].id],
    },
    teamTwo: {
      ...teams[1],
      wins: series.performance.head_to_head[teams[1].id],
    },
    gameSlug: getGameByAbiosId(series.game.id).slug,
    ties: series.performance.head_to_head.ties,
  };
}