import React, { Component } from "react";
import { IPlayer, ITeam } from "../../../lib/api/models/roster";
import { ISeriesDetail, ISessionStatus } from "../../../lib/api/models/series";
import LiveBadge from '../../common/cards/series/live-badge';
import padStart from "lodash.padstart";
import {DateTime} from 'luxon';

import {
  renderCompetitor,
  SeriesHeaderContainer,
  SeriesHighlight,
  SeriesHeaderInfo,
  BestOf,
  SeriesTeamHeader,
  SpoilerContainer
} from './components';
  
interface ILocalProps {
  showScore: boolean;
  unSpoil: (e: any) => void; 
  highlight: string;
  start: string;
  is_live: boolean;
  completed: boolean;
  scores: {
    [id: string]: string;
  };
  bestof: number;
  competitors: any[];
}

interface IState {
  interval: any;
  seconds: number;
  showResult: boolean;
}

export default class SeriesHeader extends Component<ILocalProps, IState> {
  public state: IState = {
    interval: null,
    seconds: this.getSeconds(),
  };

  public componentDidMount() {
    // If it is upcoming, start the countdown!
    if(!this.props.is_live && !this.props.completed) {
      this.setState({
        interval: setInterval(this.onInterval, 1000),
      });
    }
  }
  
  public render() {
    const {is_live, bestof, completed, scores, competitors} = this.props;
    return (
      <SeriesHeaderContainer>
        <SeriesHighlight>{this.props.highlight}</SeriesHighlight>
          <SeriesTeamHeader href={competitors[0].link} loser={this.props.showScore && completed && scores[competitors[0].id] < scores[competitors[1].id]}>
            <span>{competitors[0].name}</span> <span>{competitors[0].shortName}</span>
            {renderCompetitor(competitors[0])}
          </SeriesTeamHeader>
          <SeriesHeaderInfo>
            {is_live && <LiveBadge/>}
            <BestOf live={is_live}>Best of {bestof}</BestOf>
            { !is_live && (
              <>
              {completed ? 
                this.props.showScore ?
                  <p>{scores[competitors[0].id]} <i className="far fa-swords"></i> {scores[competitors[1].id]}</p>
                :
                  <SpoilerContainer onClick={this.props.unSpoil}>
                    <i className="fas fa-eye"></i>
                  </SpoilerContainer>
              : 
                <p>{this.getCountdown()}</p>
              }
              <span>{DateTime.fromISO(this.props.start).toFormat("t ZZZZ • EEE, dd LLL")}</span>
              </>
            )}
          </SeriesHeaderInfo>
          <SeriesTeamHeader href={competitors[1].link} loser={this.props.showScore && completed && scores[competitors[1].id] < scores[competitors[0].id]}>
            <span>{competitors[1].name}</span> <span>{competitors[1].shortName}</span>
            {renderCompetitor(competitors[1])}
          </SeriesTeamHeader>
      </SeriesHeaderContainer>
    )
  }

  
  private getCountdown() {
    const {seconds} = this.state;
    const timerHours = Math.floor(seconds / 3600);
    const timerMinutes = Math.floor((seconds - timerHours * 3600) / 60);
    const timerSeconds =  Math.floor(seconds - timerHours * 3600 - timerMinutes * 60);
    if(seconds < 86400) {
      return(`
        ${padStart(timerHours.toString(), 2, "0")} :
        ${padStart(timerMinutes.toString(), 2, "0")} :
        ${padStart(timerSeconds.toString(), 2, "0")}
      `);
    }
    return `${Math.floor(seconds / 86400)} Days`;
  }



  private getSeconds() {
    const now = new Date().getTime();
    const start = new Date(this.props.start);
    return (start.getTime() - now) / 1000;
  }

  private onInterval = () => {
    if (this.state.seconds <= 0) {
      this.setState({
        interval: clearInterval(this.state.interval),
      });
    } else {
      this.setState({
        seconds: this.state.seconds - 1,
      });
    }
  };
  
}