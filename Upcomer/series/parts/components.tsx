import styled from 'styled-components';
import {Col, Button} from 'react-bootstrap/lib/';
import {slugify} from '../../../lib/seo/slug';
import {Modal} from "@material-ui/core/";
import {NAVBAR_HEIGHT, MOBILE_NAV_HEIGHT} from '../../common/nav/components';

export const SpoilerContainer = styled.a`
  background-color: ${props => props.theme.colors.greyDark};
  color: ${props => props.theme.colors.greyLight};
  &:hover {
    background-color: ${props => props.theme.colors.grey};
    color: ${props => props.theme.colors.white};
  }
  padding: 10px 10px;
  i {
    font-size: 20px;
  }
  cursor: pointer;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  ${props => props.theme.flexBox.column.start};
  ${props => props.theme.screen.md} {
    ${props => props.theme.flexBox.row.start};
    align-items: start;
  }
  align-items: start;
  font-family: ${props => props.theme.fonts.primary};
`;
export const Column = styled(Col)`
  float: none;
  padding: 0 10px;
  margin-bottom: 30px;
  ${props => props.theme.screen.xs} {
    padding: 0 20px; 
    margin-bottom: 0px;
  }
`;
export const CommentsContainer = styled(Col)<{theaterMode: boolean}>`
  float: none;
  position: sticky;
  height: calc(100vh - ${MOBILE_NAV_HEIGHT} - 20px);
  top: calc(${MOBILE_NAV_HEIGHT} + 20px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0; 
  z-index: 10;
  background: transparent;
  ${props => props.theaterMode ? `
    height: 50%;
    width: 100%;
    bottom: 0;
    left: 0;
    top: unset;
    position: fixed;
    z-index: 1002;
    ${props.theme.screen.md} {
      max-width: 400px;
      width: 30%;
      top: 0 !important;
      bottom: unset;
      right: 0;
      left: unset;
      height: 100%;
      z-index: 1002;
    }

  ` :
    `${props.theme.screen.desktopMenu} {
      height: calc(100vh - ${NAVBAR_HEIGHT} - 20px);
      top: calc(${NAVBAR_HEIGHT} + 20px);
    }`
  }

`;
export const TournamentHeader = styled.a<{gameID: number}>`
  color: ${props => props.theme.gameColors[props.gameID]};
  &>div {
    margin-right: 10px;
  }
  &>i {
    margin-left: 4px;
  }
  &:hover {
    color: ${props => props.theme.colors.whiteTrue};
    svg path {
      fill: ${props => props.theme.colors.whiteTrue};
    }
  }
  cursor: pointer;
  font-family: ${props => props.theme.fonts.primary};
  font-size: 13px;
  line-height: 14px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
`;

export const Separator = styled.div`
  height: 0px;
  width: 100%;
  border: 1px solid ${props => props.theme.colors.blackLight};
  margin-top: 10px;
  margin-bottom: 15px;
`;

/* ====================== *
*      Series Header      *
*  ====================== */

export const SeriesHeaderContainer = styled.div`
  height: 120px;
  width: 100%;
  position: relative;
  border-radius: 5px;
  padding: 30px 0px;
  background-color: ${props => props.theme.colors.blackLight};
  ${props => props.theme.flexBox.row.center};
`;

export const SeriesHighlight = styled.p`
  width: 100%;
  position: absolute;
  text-align: center;
  margin: 0;
  top: 5px;
  color: ${props => props.theme.colors.whiteT8rue};
`;

export const SeriesHeaderInfo = styled.div`
  ${props => props.theme.flexBox.column.center};
  font-family: ${props => props.theme.fonts.primary};
  font-weight: 600;
  &>span:last-child {
    text-align: center;
    font-size: 12px;
    line-height: 12px;
    ${props => props.theme.screen.md} {
      font-size: 14px;
    }
  }
  p {
    font-family: ${props => props.theme.fonts.secondary};
    line-height: 1;
    margin: 0;
    font-size: 20px;
    margin: 5px 0;
    white-space: nowrap;
    ${props => props.theme.screen.sm} {
      font-size: 30px;
    }
    color: ${props => props.theme.colors.whiteTrue};
    i {
      font-size: 16px;
      margin: 0 5px;
      ${props => props.theme.screen.sm} {
        font-size: 24px;
        margin: 0 20px;
     }
      color: ${props => props.theme.colors.greyLight};
    }
  }
`;
export const BestOf = styled.span<{live: boolean}>`
  margin-top: 5px;
  color: ${props => props.live ? props.theme.colors.greyLight : props.theme.colors.whiteTrue};
  font-weight: ${props => props.live ? "700" : "400"};
`;

export const SeriesTeamHeader = styled.a<{loser: boolean;}>`
  ${props => props.theme.flexBox.row.end};
  color: ${props => props.loser ? props.theme.colors.greyLight : props.theme.colors.whiteTrue};
  &:last-child {
    ${props => props.theme.flexBox.row.start};
    flex-direction: row-reverse;
    justify-content: flex-end;
  }
  flex: 1;
  div, img {
    margin: 0 5px;
  }
  ${props => props.theme.screen.sm} {
    & > a {
      margin-right: 30px;
      margin-left: 10px;
    }
    &:last-child > a {
      margin-left: 30px;
      margin-right: 10px;
    }
  }
  span:nth-child(2) {
    text-align: left;
    ${props => props.theme.screen.sm} {
      display: none;
    }
  }
  span:first-child {
    display: none;
    ${props => props.theme.screen.sm} {
      display: inline-block;
    }
  }
  text-align: right;
  &:last-child {
    text-align: left;
  }
  &:hover {
    opacity: 0.6;
    color: ${props => props.theme.colors.grey};
  }
  white-space: wrap;
  font-family: ${props => props.theme.fonts.secondary};
  font-weight: 600;
  font-size: 24px;
  line-height: 27px;
`;

export const Icon = styled.img`
  width: 40px;
  height: 40px;
`;
const TeamPlaceholder = styled.div<{ url: string }>`
  display: flex;
  background-image: url(${props => props.url});
  background-position: center center;
  background-size: 80% auto;
  background-repeat: no-repeat;
  text-align: center;
  align-items: center;
  justify-items: center;
  width: 40px;
  height: 40px;
  span {
    width: auto;
    margin: 0 auto;
    font-family: alternate-gothic-no-3-d, sans-serif;
    font-size: 1.5rem;
    color: #858596;
  }
`;
export const TeamIcon = (props: any) => {
  if(/place/gi.test(props.imgSrc) && /holder/gi.test(props.imgSrc)) {
    return (
      <TeamPlaceholder className="competitor-logo" url={"/static/images/SVG/team-placeholder.svg"}>
        <span>{props.name ? props.name.substring(0,1) : "?"}</span>
      </TeamPlaceholder>
    );
  }
  return( <Icon className="competitor-logo" src={props.imgSrc}/> );
}
export const PlayerIcon = (props: any) => {
  if(/place/gi.test(props.imgSrc) && /holder/gi.test(props.imgSrc)) {
    return (
      <Icon className="competitor-logo" src={"/static/images/SVG/player-placeholder.svg"}/>
    );
  }
  return( <Icon className="competitor-logo" src={props.imgSrc}/> )
}

export interface ICompetitor {
  name: string, 
  entityType: "player" | "team", 
  icon: string, 
  entityId: number,
  id?: number,
  gameSlug: string
}
export function renderCompetitor(competitor: ICompetitor) {
  if(competitor.name === "TBD"){
   return <TeamIcon id={0} imgSrc="placeholder" name="?" noLink />;
  }
  const href = `/${competitor.gameSlug}/${competitor.entityType}/${competitor.entityId}/${slugify(competitor.name)}`;
  if(competitor.entityType === "player") {
    return (
      <a href={href}>
      <PlayerIcon
        id={competitor.entityId}
        imgSrc={competitor.icon}
        name={competitor.name}
      />
      </a>
    )
  }
  return (
    <a href={href}>
    <TeamIcon
      id={competitor.entityId}
      imgSrc={competitor.icon}
      name={competitor.name}
    />
     </a>
  );
}



/* ======================== *
* Upcomer Prediction League *
*  ======================== */
export const UPLContainer = styled.div`
  margin-top: 30px;
  color: ${props => props.theme.colors.whiteTrue};
  margin-bottom: 10px;
  ${props => props.theme.screen.sm} {
    margin-bottom: 20px;
  }
`;

export const UPLTitleBar = styled.p`
  font-weight: 600;
  font-size: 16px;
  span {
    margin-left: 10px;
    font-weight: 400;
  }
  margin-bottom: 15px;
`;

export const UPLButton = styled(Button)<{icon: string}>`
  background-color: ${props => props.theme.colors.blue};
  &:hover, &:focus:active, &:focus, &:active {
    color: ${props => props.theme.colors.whiteTrue};
    background-color: ${props => props.theme.colors.blueDark};
    background-image: url("${props => props.icon}");
  }
  background-image: url("${props => props.icon}");
  border: none;
  width: calc(50% - 10px);
  height: 80px;
  background-repeat: no-repeat;
  background-position: -35px 50%;
  background-size: 145px;
  background-blend-mode: soft-light;
  margin-right: 10px;
  &:last-child {
    margin-left: 10px;
    margin-right: 0px;
    background-position: calc(100% + 35px) 50%;
  }
  color: ${props => props.theme.colors.whiteTrue};
  font-family: ${props => props.theme.fonts.secondary};
  font-size: 15px;

  ${props => props.theme.screen.sm} {
    font-size: 24px;
  }
`;

export const UPLBarResults = styled.div`
  ${props => props.theme.flexBox.row.center};
  .competitor-logo {
    width: 60px;
    height: 60px;
  }
`;
export const UPLBarInfo = styled.div`
  ${props => props.theme.flexBox.column.center};
  align-items: space-between;
  flex: 1;
  margin: 0 10px;
  p:last-child {
    color: ${props => props.theme.colors.greyLight};
  }
  p {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-bottom: 5px;
    &>span {
      ${props => props.theme.flexBox.row.start};
      &:last-child {
        flex-direction: row-reverse;
      }
      span {
        color: ${props => props.theme.colors.greyLight};
        text-transform: uppercase;
        font-size: 10px;
      }
      i.fa-caret-left {
        margin-right: 5px;
        margin-left: 10px;
        color: ${props => props.theme.colors.greyLight};
      }
      i.fa-caret-right {
        color: ${props => props.theme.colors.greyLight};
        margin-left: 5px;
        margin-right: 10px;
      }
    }
  }
`;
export const UPLTeamName = styled.span<{winner: boolean}>`
  color: ${props => props.winner ? props.theme.colors.whiteTrue : props.theme.colors.greyLight};
`;
export const UPLBarContainer = styled.div<{leftColor: boolean, split: number}>`
  height: 5px;
  flex: 1;
  width: 100%;
  border-radius: 5px;
  background-color: ${props => props.leftColor ? props.theme.colors.greyDark : props.theme.colors.red};
  div {
    width: ${props => props.split}%;
    height: 100%;
    border-radius: 5px;
    background-color: ${props => !props.leftColor ? props.theme.colors.greyDark : props.theme.colors.red};
  }
`;

export const MatchupInfo = styled.div`
  ${props => props.theme.flexBox.row.between};
  flex-wrap: wrap;
  margin-bottom: 10px;
  ${props => props.theme.screen.sm} {
    margin-bottom: 20px;
  }
`;

export const MatchupInfoContainer = styled.div`
  width: 100%;
  margin-bottom: 10px;
  ${props => props.theme.screen.sm} {
    width: calc(50% - 10px);
  }
  border: 1px solid ${props => props.theme.colors.blackLight};
  border-radius: 5px;
  padding: 10px;
  color: ${props => props.theme.colors.whiteTrue};
  h3 {
    display: flex;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    margin: 0;
    margin-bottom: 10px;
    a {
      margin-left: auto;
    }
  }
  &>div {
    ${props => props.theme.flexBox.row.between}
  }
`;

export const PreviousMeetingsModal = styled.div`
  color: ${props => props.theme.colors.whiteTrue};
  padding: 20px;
`;

const CloseButtonContainer = styled.div`
  position: absolute;
  height: 49px;
  width: 49px;
  z-index: 2;
  top: 20px;
  right: 20px;
  button {
    display: inline-block;
    height: 49px;
    width: 49px;
    border-radius: 50%;
    border: none;
    background-color: ${props => props.theme.colors.greyDark}
  }
`;

export const CloseButton = (props: {onPress: () => void}) => {
  return (
    <CloseButtonContainer>
      <button onClick={props.onPress}>
        <img src={"/static/images/SVG/close.svg"} />
      </button>
    </CloseButtonContainer>
  )
}



export const MeetingRecord = styled.div`
  text-align: center;
  p {
    margin: 0; 
    font-family: ${props => props.theme.fonts.secondary};
    font-weight: 600;
    font-size: 24px;
    line-height: 20px;
  }
  span {
    font-size: 12px;
    color: ${props => props.theme.colors.grey};
  }
`;

export const LatestResults = styled.div`
  max-width: 50%;
  ${props => props.theme.flexBox.row.center};
  &:first-child {
    flex-direction: row-reverse;
  }
  i {
    margin: 0px 5px;
  }
  .competitor-logo {
    margin: 0 5px;
  }
`;
export const ResultBall = styled.a<{ result: "W" | "L" | "T" }>`
  font-weight: bold;
  font-size: 10px;
  line-height: 14px;
  ${props => props.theme.flexBox.row.center};
  text-align: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  margin: 2.5px;
  color: ${props => props.result === "W" ? props.theme.colors.win : props.result === "L" ? props.theme.colors.loss : props.theme.colors.grey};
  ${props => props.theme.screen.xs} {
    background-color: ${props => props.result === "W" ? props.theme.colors.win : props.result === "L" ? props.theme.colors.loss : props.theme.colors.grey};
    color: ${props => props.theme.colors.whiteTrue};
  }
  &:hover {
    background-color: ${props => props.result === "W" ? props.theme.colors.win : props.result === "L" ? props.theme.colors.loss : props.theme.colors.grey};
    color: ${props => props.theme.colors.whiteTrue};
  }
`;

export const RostersContainer = styled.div`
  ${props => props.theme.flexBox.row.between}
  align-items: flex-start;
  margin-bottom: 20px;
  ${props => props.theme.screen.sm} {
    margin-bottom: 30px;
  }
`;

export const RosterPlayerContainer = styled.a`
  display: flex;
  margin-bottom: 10px;
  &:hover {
    opacity: 0.5;
    filter: alpha(opacity=100);
  }
  ${Icon} {
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }
  div {
    margin: 0 10px;
  }
  ${props => props.theme.screen.sm} {
    div {
      background: ${props => props.theme.colors.blackLight};
      width: 100%;
      text-align: center !important;
      margin: 0 !important;
      border-radius: 0px 0px 5px 5px; 
    }
    div:last-child {
      padding: 5px;
    }
    flex-wrap: wrap;
    width: 125px;
    ${Icon} {
      height: 125px;
      width: 125px;
      border-radius: 0;
    }
  }
`;


export const PlayerImageContainer = styled.div`
  position: relative;
`;
export const PlayerFlag = styled.img`
  position: absolute;
  width: 14px;
  height: 9px;
  bottom: 0px;
  right: 4px;
  ${props => props.theme.screen.sm} {
    display: none;
  }
`;

export const RosterWrapper = styled.div`
  width: calc(50% - 10px);
  p {
    margin: 0;
    position: relative;
    color: ${props => props.theme.colors.whiteTrue};
    img {
      display: none;
      ${props => props.theme.screen.sm} {
        display: inline-block;
        width: 14px;
        height: 12px;
        position: absolute;
        left: 5px;
        top: 4px;
      }
    }
  }
  span {
    color: ${props => props.theme.colors.greyLight};
  }
  ${RosterPlayerContainer} {
    ${props => props.theme.flexBox.row.start}
  }
  &:last-child {
    ${RosterPlayerContainer} {
      flex-direction: row-reverse;
      div {
        text-align: right;
      }
    }
    ${PlayerFlag} {
      left: 4px;
    }
  }
  ${props => props.theme.screen.sm} { 
    ${props => props.theme.flexBox.row.between}
    display: grid;
    grid-template-columns: repeat(auto-fill, 125px);
    grid-gap: 10px;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

export const RosterBar = styled.div`
  display: none;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin: 0;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.whiteTrue};
  ${props => props.theme.screen.sm} {
    ${props => props.theme.flexBox.row.between};
    h3 {
      font-weight: 600;
      font-size: 18px;
      flex: 1;
      &:last-child {
        margin-left: 10px;
      }
    }
  }
`;

export const MobileRosterBar = styled(RosterBar)`
  ${props => props.theme.flexBox.row.between};
  margin-top: 0px;
  ${props => props.theme.screen.sm} {
    display: none;
  }
  h3 {
    font-size: 16px;
    font-weight: 600;
  }
`;

export const VodsContainer = styled.div`
  ${props => props.theme.flexBox.row.start};
  flex-wrap: wrap;
  margin-top: 20px;
  h2 {
    width: 100%;
    margin-bottom: 5px;
    color: white;
    font-size: 16px;
  }
`;
export const VideoModal = styled(Modal)`
  && {
    max-width: 1000px;
    margin: auto;
  }
`;
export const Vod = styled.div`
  border: 1px solid ${props => props.theme.colors.greyDark};
  padding: 5px;
  border-radius: 5px;
  ${props => props.theme.flexBox.row.between};
  margin-right: 20px;
  width: 175px;
  color: ${props => props.theme.colors.whiteTrue};
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.greyDark};
  }
`;

export const TheaterModeCover = styled.div`
  position: fixed;
  background-color: ${props => props.theme.colors.background};
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
`;

export const ShowTheaterModeButton = styled.button`
  border: none;
  z-index: 5;
  background: ${props => props.theme.colors.red};
  color: ${props => props.theme.colors.whiteTrue} !important;
  height: 40px;
  position: sticky;
  bottom: 0;
  white-space: nowrap;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  width: 320px;
  left: calc(50% - 160px);
  ${props => props.theme.screen.xs} {
    padding: 0 10px;
    border-radius: 10px;
    bottom: 5px;
  }
  ${props => props.theme.screen.md} {
    display: none;
  }
  .fa-chevron-down {
    margin-left: 10px;
  }
  ${props => props.theme.flexBox.row.between}
`;

export const PaddingBlock = styled.div`
  z-index: 10;
  height: 30px;
  width: 100%;
  ${props => props.theme.screen.md} {
    display: none;
  }
`;