import styled from "styled-components";
import {Component} from 'react';

// UI
import {
  RosterWrapper,
  RosterPlayerContainer,
  PlayerIcon,
  RosterTitle,
  PlayerImageContainer,
  PlayerFlag
} from './components'
import IRoster from "../../../lib/api/models/roster";


interface IProps {
  roster: IRoster;
  gameSlug: string;
}

export default class Roster extends Component<IProps> {

  public componentDidCatch(error: Error | null, info: object) {
    /* tslint:disable-next-line */
    console.log(error);
    return(
      <div></div>
    )
  }

  public shouldComponentUpdate(nextProps: IProps) {
    if(nextProps.roster.id !== this.props.roster.id) {
      return true;
    }
    return false;
  }

  public render() {
    const {roster, gameSlug} = this.props;
    if(!roster || !roster.players) {
      return <div></div>
    }
    return (
      <>
      <RosterWrapper>
        {
          roster.players.map(player => (
            <RosterPlayerContainer href={`/${gameSlug}/player/${player.id}/${player.nick_name}`}>
              <PlayerImageContainer>
                <PlayerIcon imgSrc={player.images.default}/>
                <PlayerFlag src={player.country.images.thumbnail}/>
              </PlayerImageContainer>
              <div>
                <p> <img src={player.country.images.thumbnail}/>{player.nick_name} </p>
                <span> {player.role} </span>
              </div>
            </RosterPlayerContainer>
          ))
        }
      </RosterWrapper>
      </>
    );
  }
};