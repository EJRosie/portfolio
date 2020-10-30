/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Head from 'next/head';

import Header from '../src/components/common/header';
import Footer from '../src/components/common/footer';

class FAQ extends React.Component {

  render() {
    return (
      <Container>
        <Head>
          <title>b*dazzle • FAQ</title>
        </Head>
        <Header/>
        <Content>
          <h1>{this.props.t('faq')}</h1>
          
          <h3>{this.props.t('q1')}</h3>
          <p>{this.props.t('a1')}</p>
          
          <h3>{this.props.t('q2')}</h3>
          <p>{this.props.t('a2')}</p>
          
          <h3>{this.props.t('q3')}</h3>
          <p>{this.props.t('a3')}</p>

          <h3>{this.props.t('q4')}</h3>
          <p>{this.props.t('a4')}</p>

          <h3>{this.props.t('q5')}</h3>
          <p>{this.props.t('a5')}</p>

          <h2>{this.props.t('bookingAVideo')}</h2>

          <h3>{this.props.t('q6')}</h3>
          <p>{this.props.t('a6')}</p>

          <h3>{this.props.t('q7')}</h3>
          <p>{this.props.t('a7')}</p>
          <p>{this.props.t('a7Note')}</p>

          <h2>{this.props.t('recievingAVideo')}</h2>
        
          <h3>{this.props.t('q8')}</h3>
          <p>{this.props.t('a8')}</p>

          <h3>{this.props.t('q9')}</h3>
          <p>{this.props.t('a9')}</p>

          <h3>{this.props.t('q10')}</h3>
          <p>{this.props.t('a10')}</p>

          <h3>{this.props.t('q11')}</h3>
          <p>{this.props.t('a11')}</p>

          <h3>{this.props.t('q12')}</h3>
          <p>{this.props.t('a12')}</p>

          <h3>{this.props.t('q13')}</h3>
          <p>{this.props.t('a13')}</p>

          <h2>{this.props.t('payments')}</h2>

          <h3>{this.props.t('q14')}</h3>
          <p>{this.props.t('a14')}</p>

          <h3>{this.props.t('q15')}</h3>
          <p>{this.props.t('a15')}</p>

          <h3>{this.props.t('q16')}</h3>
          <p>{this.props.t('a16')}</p>

          <h2>{this.props.t('otherQuestions')}</h2>

          <h3>{this.props.t('q17')}</h3>
          <p>{this.props.t('a17A')} <a href={"mailto:contact@bdazzle.me"}>contact@bdazzle.me</a> {this.props.t('a17B')}</p>

          <h3>{this.props.t('q18')}</h3>
          <p>{this.props.t('a18')}</p>

          <h3>{this.props.t('q19')}</h3>
          <p>{this.props.t('a19')}</p>

        
        
        </Content>
        <Footer/>
      </Container>
    );
  }

}
const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

const Container = styled.div``;
const Content = styled.div`
  padding: 20px;
  font-size: 18px;
  line-height: 24px;
  color: #999999;
  p {
    margin: 0;
    margin-bottom: 10px;
  }
  span {
    font-weight: bold;
    color: black;
  }
  h1 {
    font-weight: 800;
    font-size: 24px;
    line-height: 26px;
    letter-spacing: 0.02em;
    color: ${props => props.theme.palette.blue};
  }
  h2 {
    font-size: 24px;
    line-height: 26px;
    letter-spacing: 0.02em;
    font-weight: 800;
    margin-top: 40px;
    color: black;
  }
  h3 {
    font-weight: bold;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 5px;
    color: ${props => props.theme.palette.text.black};
  }
`;
export default withTranslation('faq')(FAQ)

