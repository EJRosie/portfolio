/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Head from 'next/head';

import Splash from '../src/components/home/splash';
import Footer from '../src/components/common/footer';
import Creator from '../src/components/home/creator';

class Index extends React.Component {

  render() {
    return (
      <Container>
        <Head>
          <title>b*dazzle • personalized video messages from your favorite celebrities</title>
        </Head>
        <Splash/>
        <CreatorContainer>
          <Creator
            price={300}
            name={"Alex"}
            href={"/profile/Alex"}
            src={"https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/AlexProfile.JPG?alt=media"}
          />
          <Creator
            price={350}
            name={"Aaumaim"}
            href={"/profile/Aaumaim"}
            src={"https://firebasestorage.googleapis.com/v0/b/b-dazzle.appspot.com/o/AaumaimProfile.JPG?alt=media"}
          />
          <p>{this.props.t('moreTalent')}</p>
        </CreatorContainer>
        <HowItWorks id={"how_it_works"}>
          <h2>{this.props.t('howItWorks')}</h2>
          <Step>
            <img src={"/static/images/Step1.png"}/>
            <h3>{this.props.t('step1Title')}</h3>
            <p>{this.props.t('step1Text')}</p>
          </Step>
          <Step>
            <img src={"/static/images/Step2.png"}/>
            <h3>{this.props.t('step2Title')}</h3>
            <p>{this.props.t('step2Text')}</p>
          </Step>
          <Step>
            <img src={"/static/images/Step3.png"}/>
            <h3>{this.props.t('step3Title')}</h3>
            <p>{this.props.t('step3Text')}</p>
          </Step>
        </HowItWorks>
        <Footer/>
      </Container>
    );
  }

}
const Container = styled.div`
  min-height: 100vh;
  ${props => props.theme}
`;
const Step = styled.div`
  &:last-child { img {width:280px;} }
  ${props => props.theme.flex.column.start}
  margin-bottom: 20px;
  img {
    width: 200px;
  }
  h3 {
    color: ${props => props.theme.palette.text.black};
    font-weight: bold;
    font-size: 23px;
    line-height: 30px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.03em;
    margin: 5px 0px;
  }
  p {
    text-align: center;
    margin: 0;
    color: ${props => props.theme.palette.text.dark};
    font-size: 18px;
    line-height: 23px;
    letter-spacing: 0.03em;
  }
`;
const HowItWorks = styled.div`
  padding: 20px;
  ${props => props.theme.flex.column.start}
  h2 {
    margin-bottom: 30px;
    margin-top: 10px;
    font-weight: bold;
    font-size: 24px;
    line-height: 40px;
    text-align: center;
    color: ${props => props.theme.palette.blue};
  }
`;
const CreatorContainer = styled.div`
  &>p {
    color: ${props => props.theme.palette.text.light};
    font-size: 16px;
    text-align: center;
    width: 100%;
    font-style: italic;
  }
  padding: 10px;
  ${props => props.theme.flex.row.start}
  flex-wrap: wrap;
  border-bottom: 1px solid #F1F1F1;
`;
export default withTranslation('common')(Index)

