import styled from "styled-components";
import {Component} from 'react';
import Modal from "../../modals";

// UI
import {
  ICompetitor,
  renderCompetitor,
  MatchupInfoContainer,
  MeetingRecord,
  PreviousMeetingsModal,
  CloseButton
} from './components'


interface IProps {
  competitors: ICompetitor[];
  previousMeetings: {
    [id: string]: number,
    ties: number
  };
  previousMatches: any[];
}

export default class PreviousMeetings extends Component<IProps> {
  public state = {
    showModal: false,
  }

  public componentDidCatch(error: Error | null, info: object) {
    /* tslint:disable-next-line */
    console.log(error);
    return(
      <div></div>
    )
  }

  public render() {
    const {competitors} = this.props;
    return (
      <MatchupInfoContainer>
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({showModal: false})}
        >
          <PreviousMeetingsModal>
            <h3>Previous Meetings (1YR) <CloseButton onPress={() => this.setState({showModal: false})}/> </h3>

          </PreviousMeetingsModal>
        </Modal>
        <h3>Previous Meetings (1YR) {false && this.props.previousMatches.matches.length > 0 && <a href={"#"} onClick={() => this.setState({showModal: true})}>See Match{this.props.previousMatches.matches.length > 1 && "es"} {`>`}</a> }</h3>
        <div>
          {renderCompetitor(competitors[0])}
          <MeetingRecord>
            <p> {this.props.previousMeetings[competitors[0].id] || 0} </p>
            <span> Wins </span>
          </MeetingRecord>
          <MeetingRecord>
            <p> {this.props.previousMeetings.ties} </p>
            <span> Draws </span>
          </MeetingRecord>
          <MeetingRecord>
            <p> {this.props.previousMeetings[competitors[1].id] || 0} </p>
            <span> Wins </span>
          </MeetingRecord>
          {renderCompetitor(competitors[1])}
        </div>
      </MatchupInfoContainer>
    );
  }
};