/* eslint-disable jsx-a11y/anchor-is-valid */

const Alex = {
  name: "Alex",
  image: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/AlexProfile.JPG?alt=media",
  price: 30000,
  nickname: "Alex",
  url: "Alex",
  job: "Actor",
  jobThai: "นักแสดง",
  message: "Hi! It's me Alex. Thank you for following me :) I'm ready to send you all happiness and smiling to you guys!",
  messageThai: "Hi! อเล็กซ์ครับ ขอบคุณที่ติดตามนะครับ :) หวังว่าจะทำให้ทุกคนมีความสุขจากวิดีโอของอเล็กซ์นะครับ",
  responseTime: 2,
  testimony: "OMG! I'm his big FANS. Thank you for my birthday video. You made my day!!",
  testimonyThai: "ปลื้มอเล็กซ์มากเลยค่ะ น่ารักมากๆ ได้วิดีโอวันเกิดไป เจอรอยยิ้มไปอีก ละลายแล้วค่ะ",
  ratings: 7,
  latestVideoA: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAlex4DrJoe.MP4?alt=media",
  latestVideoAFor: "Dr. Joe",
  latestVideoARequest: "Can you recommend me any places to visit for a weekend in Lampang? Any good restaurants?",
  latestVideoARequestThai: "ที่ลำปางมีสถานที่ท่องเที่ยวที่ไหนน่าไปบ้าง?",
  latestVideoB: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAlex4Ice01.MP4?alt=media",
  latestVideoBFor: "Ice",
  latestVideoBRequest: "Can you sing the song “Rak-Tid-Siren”?",
  latestVideoBRequestThai: "อยากให้อเล็กซ์ร้องเพลงรักติดไซเรนค่ะ",
  latestVideoC: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAlex4Peace01.MP4?alt=media",
  latestVideoCFor: "Peace",
  latestVideoCRequest: "How can you smile so much?",
  latestVideoCRequestThai: "ทำยังไงให้เป็นคนยิ้มง่ายแบบพี่อเล็กซ์คะ? ชอบรอยยิ้มพี่อเล็กซ์มากๆเลยค่ะ",
}
const Aaumaim = {
  name: "Aaumaim",
  image: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/AaumaimProfile.JPG?alt=media",
  price: 35000,
  nickname: "Aaumaim",
  url: "Aaumaim",
  job: "Actress",
  jobThai: "นักแสดง",
  message: "Hello BDAZZLE! I'm here for you guys now. If you like my videos, please leave me a positive review. Thank you.",
  messageThai: "Hello BDAZZLE! ขอบคุณที่ติดตามอิ๋มนะคะ ถ้าชอบวิดีโอที่อิ๋มทำให้ ขอรีวิวน่ารักๆให้เค้าด้วยน้า",
  responseTime: 2,
  testimony: "You're so cute!! what I can say??? THANK YOU Aim!",
  testimonyThai: "อิ๋มน่ารักมากเลย วิดีโอที่อัดให้น่ารักมาก ขอบคุณนะคับ",
  ratings: 6,
  latestVideoA: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAim4Ham.MP4?alt=media",
  latestVideoAFor: "Ham",
  latestVideoARequest: "It’s my birthday today! Could you wish me happy birthday?",
  latestVideoARequestThai: "อยากให้อิ๋มอวยพรวันเกิดให้ครับ",
  latestVideoB: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAim4Fern01.MP4?alt=media",
  latestVideoBFor: "Fern",
  latestVideoBRequest: "How did you become a streamer?",
  latestVideoBRequestThai: "อยากรู้ว่าอิ๋มมาเป็นสตรีมเมอร์ได้ยังไง?",
  latestVideoC: "https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/Videos%2FAim4Ken01.MP4?alt=media",
  latestVideoCFor: "Ken",
  latestVideoCRequest: "I have the important exam coming up! Can you help motivate me?",
  latestVideoCRequestThai: "อยากให้อิ๋มให้กำลังใจก่อนสอบ",
}

import React from 'react';
import { i18n, Link, withTranslation } from '../i18n'
import styled from 'styled-components';
import Head from 'next/head';
import Router from 'next/router';
import Checkout from '../src/components/creator/request-form';
import PaymentForm from '../src/components/checkout/payment-form';
import VideoCard from '../src/components/creator/video';
import Footer from '../src/components/common/footer';
import Header from '../src/components/common/header';
import ReactGA from 'react-ga';
import {CardElement, injectStripe, Elements, StripeProvider} from 'react-stripe-elements';

class CreatorProfile extends React.Component {
  static async getInitialProps({isServer,req,res,query,store,}) {
    return {
      creator: query.creator.toLowerCase() =="alex" ? Alex : Aaumaim,
      stripeKey: query.stripeKey
    };
  }
  state = {
    ...this.props.creator,
    muted: true,
    loaded: false,
    details: "",
    for: "",
    line: "",
    public: true,
    paymentType: "card",
    continuedToPayment: false,
    tip: 5000
  }
  componentDidMount() {
    this.setState({loaded: true});
  }
  handleChange = name => event => {
    if(name == "paymentType") {
      ReactGA.event({
        category: 'Payment Event',
        action: 'Changed Payment Type',
        label: "Switched to " + event.target.value,
        nonInteraction: true
      });
    }
    this.setState({[name]: event.target.value });
  };
  render() {
    if(!this.state.loaded) {
      Router.beforePopState(() => {
        if(this.state.continuedToPayment) {
          this.setState({continuedToPayment: false});
          return false;
        }
        if(!this.state.continuedToPayment) {
          return true;
        }
      });
    }
    return (
      <StripeProvider apiKey={this.props.stripeKey}>
      <Container>
        <Head>
          <title>b*dazzle • Talent</title>
        </Head>
        <Header/>
      <Content>
        { this.state.continuedToPayment ?
          <Elements>
            <PaymentForm
              onChange={this.handleChange} 
              changeState={(name, val) => this.setState({[name]: val})}
              state={this.state}
            />
          </Elements>
        :
        <>
          <Checkout
            onChange={this.handleChange} 
            changeState={(name, val) => this.setState({[name]: val})}
            state={this.state}
            onContinue={() => this.onContinue()}
          />
          {this.state.loaded && 
          <VideoList>
            <h2>{this.props.t('latestVideos')}</h2>
            <VideoCard
              requester={this.state.latestVideoAFor}
              request={i18n.language == "en" ? this.state.latestVideoARequest : this.state.latestVideoARequestThai}
              src={this.state.latestVideoA}
            />
            <VideoCard 
              requester={this.state.latestVideoBFor}
              request={i18n.language == "en" ? this.state.latestVideoBRequest : this.state.latestVideoBRequestThai}
              src={this.state.latestVideoB}
            />
            <VideoCard 
              requester={this.state.latestVideoCFor}
              request={i18n.language == "en" ? this.state.latestVideoCRequest : this.state.latestVideoCRequestThai}
              src={this.state.latestVideoC}
            />
            <QuestionsLine>{this.props.t('onlyThreeVideos')}</QuestionsLine>
          </VideoList>
          }
        </>
        }
        <QuickInfo>
          <p>{this.props.t('quickQ1')}</p>
          <p>{this.props.t('quickA1')}</p>
          <p>{this.props.t('quickQ2')}</p>
          <p>{this.props.t('quickA2')}</p>
          <p>{this.props.t('quickQ3')}</p>
          <p>{this.props.t('quickA3')}</p>
          <p>{this.props.t('quickQ4')}</p>
          <p>{this.props.t('quickA4')}</p>
        </QuickInfo>
      </Content>

      <Footer/>
      </Container>
      </StripeProvider>
    );
  }
  onContinue() {    
    if(!this.state.continuedToPayment) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0; 
      this.setState({continuedToPayment: true});
      Router.push(window.location.pathname, window.location.pathname + "#payment", { shallow: true });
      ReactGA.pageview("/payment");
    }
  }
}
const QuickInfo = styled.div`
  p {margin: 0; font-size: 16px;}
  p:nth-child(2n){
    margin-bottom: 10px;
  }
  p:nth-child(odd){
   font-weight: bold;
  }
  p:last-child{
    font-weight: 500;
   }
`;
const QuestionsLine = styled.p`
  margin: 0;
  font-size: 16px;
  width: 100%;
  text-align: center;
`;
const VideoList = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 24px;
  color: #999999;
  align-items: center;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.palette.background.white};
  h2 {
    text-align: center;
    font-weight: 800;
    font-size: 20px;
    line-height: 26px;
    color: #7C9BCD;
    margin: 0;
    margin-bottom: 15px;
  }
`;
const Content = styled.div`
  padding: 20px;
  margin-bottom: -10px;
  font-size: 18px;
  line-height: 24px;
  color: #999999;
  background-color: ${props => props.theme.palette.background.grey};
`;

const Container = styled.div`
  &>div:first-child {
    a>img {
      width: 90%;
    }
    position: absolute;
    max-width: 800px;
    top: 10px;
    left: 10px;
    z-index: 100;
  }
`;
export default withTranslation('profile')(CreatorProfile)