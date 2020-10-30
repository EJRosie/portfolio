/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardMedia} from '@material-ui/core';
import ReactPlayer from 'react-player'

class VideoCard extends React.Component {
  state = {
    playing: false
  }
  render() {
    return (
      <>
        <VideoInfo>
          <p>{this.props.t('request', {name: this.props.requester})}</p>
          <span>{this.props.request}</span>
        </VideoInfo>
        <Video controls preload="metadata" >
          <source src={this.props.src + "#t=0.1"} type="video/mp4"/>
        </Video>
      </>
    );
  }
}

const Video = styled.video`
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  margin-bottom: 20px;
  height: 60vh;
  max-width: 100%;
`;
const VideoInfo = styled.div`
  p {
    color: ${props => props.theme.palette.text.dark};
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    text-align: center;
  }
  span {
    display: block;
    color: ${props => props.theme.palette.text.dark};
    text-align: center;
    margin-bottom: 10px;
  }
`;
export default withTranslation('profile')(VideoCard)