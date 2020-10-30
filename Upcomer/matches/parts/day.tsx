import { Component } from "react";
import styled from "styled-components";
import moment from 'moment';
import Col from "react-bootstrap/lib/Col";
import { IMatchDay, ISeriesDetail } from "../../../lib/api/models/series";
import Tournament from "../../common/cards/matches/long-tournament";
import Placeholder from '../../common/cards/placeholder';

const Today = styled.p`
  color: ${props => props.theme.colors.red};
  text-align: right;
  margin: 0;
  margin-right: 8px;
  &~span {
    color: ${props => props.theme.colors.grey};
  }
`
const Tomorrow = styled(Today)`
  color: ${props => props.theme.colors.whiteTrue};
`;
const Day = styled.div`
  min-height: 100px;
  width: 100%;
  align-items: flex-start;
  margin-bottom: 40px;
  display: block;
`;
const MatchFlexBox = styled(Col)`
  display: flex;
  flex-direction: column;
  float: none;
  &.today {
    .match-card {
      border-left: ${props => props.theme.colors.red} 5px solid;
    }
  }
`;

const Header = styled(Col)`
  position: sticky;
  top: 140px;
  ${props => props.theme.screen.desktopMenu} {
    top: 110px;
  }
  z-index: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  ${props => props.theme.screen.md} {
    justify-content: flex-end;
    top: 150px;
  }
  font-size: 28px;
  align-items: right;
  line-height: normal;
  font-family: ${props => props.theme.fonts.primary};
  color: ${props => props.theme.colors.grey};
  background-color: #101019;
  text-transform: uppercase;
`;

const HeadingLeft = styled.div`
  padding: 5px;
  ${props => props.theme.flexBox.row.start}
  ${props => props.theme.screen.md} {
    display: block;
    p {
      margin-bottom: 10px;
    }
  }
  color: ${props => props.theme.colors.whiteTrue};
  text-align: right;
  font-family: Open Sans;
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;
  letter-spacing: 0.1px;
  
`;

interface ILocalProps {
  day: IMatchDay;
  details?: boolean;
  gameSlug: string;
  windowSize: number;
}

export default class MatchDay extends Component<ILocalProps> {
  public render() {
    const {date, results} = this.props.day;
    const isToday = moment().isSame(date, "days");
    const tomorrow = moment().add(1, 'days').startOf('day');
    const isTomorrow = tomorrow.isSame(date, "days");

    return (
      <Day>
        <Header
          xs={12}
          md={2}
        >
          <HeadingLeft>
          { isToday && <Today id="today" className="today">Today </Today>}
          { isTomorrow && <Tomorrow id="tomorrow" className="tomorrow">Tomorrow </Tomorrow>}
          <span>{moment(date).format('ddd, DD MMM')}</span>
          </HeadingLeft>
        </Header>
        <MatchFlexBox
          xs={12}
          md={10}
          className={isToday ? "today" : ""}
        >
          {(
            results.map((result) => {
              return (
                <Tournament windowSize={this.props.windowSize} tournament={result} />
              );
            })
          )}
          {results.length === 0 && (isToday || isTomorrow) &&
            <Placeholder>
              Sorry, there are no matches.
            </Placeholder>
          }
        </MatchFlexBox>
      </Day>
    );
  }
}
