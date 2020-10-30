import styled from "styled-components";
import {Component} from 'react';
import ErrorContainer from '../../common/error-container';

// UI
import {
  ICompetitor,
  renderCompetitor,
  MatchupInfoContainer,
  LatestResults,
  ResultBall
} from './components'


interface IProps {
  competitors: ICompetitor[];
  previousMeetings: {
    [id: string]: number,
    ties: number
  };
  latestResults: {
    [id: string]: {
      result: "W" | "L" | string;
      series_id: number;
    }
  }
  gameSlug: string;
}

export default class LatestResultsComponent extends Component<IProps> {

  public componentDidCatch(error: Error | null, info: object) {
    /* tslint:disable-next-line */
    console.log(error);
    return(
      <div></div>
    )
  }

  public render() {
    const {competitors, latestResults, gameSlug} = this.props;
    return (
      <MatchupInfoContainer>
        <h3>Latest Results</h3>
        <div>
          <LatestResults>
            <i className="fas fa-chevron-right"></i>
            { latestResults &&
              (latestResults[competitors[0].id] || []).map((result) => (
                result && <ResultBall href={`/${gameSlug}/match/${result.series_id}`} result={result.result}> {result.result} </ResultBall>
              ))
            }
            {renderCompetitor(competitors[0])}
          </LatestResults>
          <LatestResults>
            <i className="fas fa-chevron-left"></i>
            { latestResults &&
              (latestResults[competitors[1].id] || []).map((result) => (
                result && <ResultBall href={`/${gameSlug}/match/${result.series_id}`} result={result.result}> {result.result} </ResultBall>
              ))
            }
            {renderCompetitor(competitors[1])}
          </LatestResults>
        </div>
      </MatchupInfoContainer>
    );
  }
};