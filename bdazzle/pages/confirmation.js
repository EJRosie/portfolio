/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Head from 'next/head';

import Header from '../src/components/common/header';
import Footer from '../src/components/common/footer';

class Confirmation extends React.Component {
  static async getInitialProps({isServer,req,res,query,store,}) {
    return ({query});
  }
  render() {
    const {query} = this.props;
    return (
      <>
      <Head>
        <title>bdazzle • Confirmation</title>
      </Head>
      <BodyContainer>
        <Header/>
        <Container>
          <SectionTitle>{this.props.t('thanksForOrder')}</SectionTitle>
          <WhatsNext>
            <h2>{query.paymentType == "card" ? this.props.t('whatsNext') : this.props.t('whatsNextB')}</h2>
            {query.paymentType == "card" ?
              <InfoLine>{this.props.t('ifAcceptedCardA')} <a href={"mailto:contact@bdazzle.me"}>contact@bdazzle.me</a> {this.props.t('ifAcceptedCardB')} <a href="http://nav.cx/fGe36Wd">@bdazzle</a> {this.props.t('ifAcceptedCardC')}</InfoLine>
              :
              <InfoLine>{this.props.t('ifAcceptedTransferA')} <a href={"mailto:contact@bdazzle.me"}>contact@bdazzle.me</a> {this.props.t('ifAcceptedTransferB')} <a href="http://nav.cx/fGe36Wd">@bdazzle</a> {this.props.t('ifAcceptedTransferC')}</InfoLine>
            }
            {query.paymentType == "transfer" && (
              <>
              <InfoLine><span>{this.props.t('bankName')}:</span> SCB</InfoLine>
              <InfoLine><span>{this.props.t('bankAccNum')}:</span> 3762529673</InfoLine>
              <InfoLine><span>{this.props.t('reciptientName')}:</span> Sasiwan Wongbubpa</InfoLine>
              <InfoLine><span>{this.props.t('confrimPayment')}:</span> {this.props.t('sendReceiptA')} <a href="http://nav.cx/fGe36Wd">@bdazzle</a> {this.props.t('sendReceiptB')}</InfoLine>
              </>
            )}
          </WhatsNext>
            <SectionTitle>{this.props.t('bookingInfo')}</SectionTitle>
            <InfoLine><span>{this.props.t('influencer')}: </span>{query.creator}</InfoLine>
            <InfoLine><span>{this.props.t('yourName')}: </span>{query.for}</InfoLine>
            <InfoLine><span>{this.props.t('yourRequest')}: </span>{query.details}</InfoLine>
          <SectionTitle>{this.props.t('deliveryInfo')}</SectionTitle>
          <InfoLine><span>{this.props.t('toBeCharged')}: </span>{query.total / 100}฿</InfoLine>
          <InfoLine><span>{this.props.t('lineApp')}: </span>{query.line}</InfoLine>

          <QuickInfo>
            <p>{this.props.t('quickQ1')}</p>
            <p>{this.props.t('quickA1')}</p>
            <p>{this.props.t('quickQ2')}</p>
            <p>{this.props.t('quickA2')}</p>
            <p>{this.props.t('quickQ3')}</p>
            <p>{this.props.t('quickA3')}</p>
          </QuickInfo>
        </Container>
        <Footer/>
      </BodyContainer>
      </>
    )
  }
}
const QuickInfo = styled.div`
margin-top: 20px;
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
const BodyContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const InfoLine = styled.p`
  color: #999999;
  margin: 10px 0px;
  font-size: 18px;
  span {
    font-weight: bold;
    color: black;
  }
`;
const WhatsNext = styled.div`
  margin: 0 -20px;
  padding: 20px;
  background-color: #F1F1F1;
  margin-bottom: 15px
  h2 {
    margin: 0;
    margin-bottom: 5px;
    font-weight: 800;
    font-size: 18px;
    line-height: 23px;
    display: flex;
    align-items: center;
    color: ${props => props.theme.palette.text.dark};
  }
  span {
    color: ${props => props.theme.palette.text.dark} !important;
  }
  a {
    color: ${props => props.theme.palette.blue};
    text-decoration: none;
  }
`;
const Container = styled.div`
  padding: 20px;
  ${props => props.theme.flex.column.start}
  align-items: stretch;
  flex: 1;
`;
const SectionTitle = styled.h2`
  color: ${props => props.theme.palette.blue};
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  margin: 5px 0px;
`;

export default withTranslation('checkout')(Confirmation)