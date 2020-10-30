/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import firebase, {config} from '../src/firebase';
import Header from '../src/components/common/header';
import Footer from '../src/components/common/footer';
import {Button, TextField} from '@material-ui/core';
import StarRatingComponent from 'react-star-rating-component';
import Head from 'next/head';
import ReactPlayer from 'react-player'
import {
  FacebookShareButton,
  LineShareButton
} from 'react-share';
const uuidv1 = require('uuid/v1');

class VideoPlayer extends React.Component {
  static async getInitialProps({isServer,req,res,query,store,}) {
    const videoPath = "https://firebasestorage.googleapis.com/v0/b/" + config.storageBucket + "/o/Videos%2F" + encodeURI(query.hash) + "?alt=media";
    return {
      videoPath,
      videoName: encodeURI(query.hash)
    };
  }
  state = {
    video: this.props.video,
    rating: 0,
    feedback: "",
    submitted: false,
    id: uuidv1(),
    error: null,
    href: `bdazzle.me/video/${this.props.videoName}`
  }
  loadVideo() {
    const storageRef = firebase.storage().ref();
    var vidRef = storageRef.child(`Videos/${this.props.videoName}`);
    vidRef.getDownloadURL().then((res) => {
      console.log(res);
    }).catch(e => {
      this.setState({error: "No Video Found"});
    });
  }
  componentDidMount() {
    this.loadVideo();
  }

  render() {
    if(!!this.state.error) {
      return (
      <Container>
        <Head>
          <title>b*dazzle • Error</title>
        </Head>
        <Header/>
        <Content>
          <p>{this.props.t('noVideoFound')}</p>
        </Content>
        <Footer/>
      </Container>
      );
    }
    return (
      <Container>
        <Head>
          <title>b*dazzle • Video</title>
        </Head>
        <Header/>
        <Content>
          {/* <Title>{this.props.t('for')} {"User"}</Title> */}
          <Video 
            playsinline
            url={this.props.videoPath}
            width='100%'
            height='100%'
            controls
          />
          <ButtonGroup>
          <FacebookShareButton url={`bdazzle.me/video/${this.props.videoName}`}>
            <Button variant="outlined" color="default"><i className="fab fa-facebook-f"></i> {this.props.t('share')}</Button>
          </FacebookShareButton>
          <LineShareButton url={`bdazzle.me/video/${this.props.videoName}`}>
            <Button variant="outlined" color="default"><i className="fab fa-line"></i> {this.props.t('share')}</Button>
          </LineShareButton>
          </ButtonGroup>
          <ViewButton href={`/`} variant="contained" color="primary" >{this.props.t('viewProfile', {name: this.props.creator})}</ViewButton>
          <FeedbackContainer>
            <h2>{this.props.t('rateThisVideo')}</h2>
            <StarRatingComponent
              name="rating" 
              starCount={5}
              value={this.state.rating}
              onStarClick={(val) => this.onStarChange(val)}
            />
          <Input
            id="feedback" placeholder={this.props.t('feedback')} margin="dense" multiline variant="outlined" rows={8}
            onChange={(val) => this.setState({feedback: val.target.value})}
            helperText={<HelperText>{`${this.state.feedback.length}/250`} {this.props.t('limit')}</HelperText>}
          />
            <ViewButton disabled={this.state.feedback.length < 1} variant="contained" disable={this.state.submitted} onClick={() => this.submitFeedback()}>
            {this.props.t('submit')}
            </ViewButton>
          </FeedbackContainer>
        </Content>
        <Footer/>
      </Container>
    );
  }

  onStarChange(value) {
    this.setState({rating: value});
    fetch("/feedback", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: this.state.id, rating: value, videoName: this.props.videoName})
    });
  }

  submitFeedback() {
    this.setState({submitted: true});
    fetch("/feedback", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({feedback: this.state.feedback, rating: this.state.rating, videoName: this.props.videoName})
    });
  }

}
const Video = styled(ReactPlayer)`
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  width: 100%;
`;
const FeedbackContainer = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  i {
    font-size: 30px;
  }
  h2 {
    text-align: center;
    margin-top: 20px;
    margin-bottom: 10px;
  }
`;
const ViewButton = styled(Button)`
&& {
  width: 100%;
  height: 45px;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.08em;
  color: white !important;
  background-color: ${props => props.theme.palette.primary.dark};
}
`;
const Input = styled(TextField)`
  && {
    fieldset {
      border: 1px solid #8AD8A3;
    }
    width: 100%;
  }
`;
const HelperText = styled.span`
  text-align: right;
  display: block;
`;
const ButtonGroup = styled.div`
  ${props => props.theme.flex.row.around}
  margin: 10px -5px;
  div {
    flex: 10;
    max-width: 120px;
    margin: 5px;
  }
  button, a {
    width: 100%;
    max-width: 120px;
    padding: 5px 10px;
    font-weight: normal;
    font-size: 14px;
    line-height: 18px;
    display: flex;
    text-transform: capitalize;
    align-items: center;
    letter-spacing: 0.04em;
    span {
      ${props => props.theme.flex.row.around}
      font-size: 14px;
      line-height: 18px;
      display: flex;
      align-items: center;
      letter-spacing: 0.04em;
    }
  }
`;
const Container = styled.div``;
const Content = styled.div`
  padding: 20px;
  font-size: 18px;
  line-height: 24px;
  min-height: 80vh;
  color: #999999;
`;
const Title = styled.h1`
  color: ${props => props.theme.palette.blue};
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  display: flex;
  align-items: center;
  margin: 5px 0px;
`;


export default withTranslation('common')(VideoPlayer)