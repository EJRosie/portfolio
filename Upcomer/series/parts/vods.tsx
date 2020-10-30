import React, { Component } from "react";
import ReactPlayer from "react-player";
import ReactGA from 'react-ga';

import {
  VodsContainer,
  Vod,
  VideoModal
} from './components';
  
interface ILocalProps {
  videos: Array<{
    title: string;
    type: "VOD" | "Highlight";
    provider: string;
    url: string;
    thumbnail: string;
    game_number: number;
  }>;
}


export default class VODs extends Component<ILocalProps, {showVodModal: boolean, vodURL: string}> {
  public state = {
    showVodModal: false,
    vodURL: ""
  }
  
  public render() {
    const {videos} = this.props;
    return (
      videos.length > 0 && (
        <VodsContainer>
          <VideoModal
            open={this.state.showVodModal}
            onClose={() => this.setState({showVodModal: false})}
          >
            <ReactPlayer
              url={this.state.vodURL}
              style={{ border: "none" }}
              width="100%"
              height="70vh"
              controls={true}
              />
          </VideoModal>
          <h2>VODs</h2>
          {
            videos.map(vod => 
              <Vod 
                onClick={() => this.openModal(vod)}
                className={`${vod.game_number === 0 ? "full-" : "game-"}${vod.type.toLowerCase()}`}
              >
                {
                  vod.game_number === 0 ?
                    vod.type === "VOD" ? "Full Match" : "Full Highlights"
                  :
                    `Game ${vod.game_number} ${vod.type === "Highlight" ? "Highlights": ""}`
                }
                {vod.provider === "youtube" && <i className="fab fa-youtube"></i>}
                {vod.provider === "twitch" && <i className="fab fa-twitch"></i>}
              </Vod>
            )
          }
        </VodsContainer>
      )
    );
  }

  private openModal = (vod: any) => {
    let embedURL = vod.url;
    if(vod.provider === "youtube") {
      const match = vod.url.match(/\?v=(.*)/i);
      const videoId = match ? match[1] : null;
      embedURL = `https://www.youtube.com/embed/${videoId}`;
    }
    this.setState({vodURL: embedURL, showVodModal: true});
  } 

}