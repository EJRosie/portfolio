/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { withTranslation } from '../i18n'
import styled from 'styled-components';
import Head from 'next/head';

import Header from '../src/components/common/header';
import Footer from '../src/components/common/footer';

class Index extends React.Component {

  render() {
    return (
      <Container>
        <Head>
          <title>b*dazzle • About Us</title>
        </Head>
        <Header/>
        <Content>
          <h1>{this.props.t('aboutUs')}</h1>
          <p>{this.props.t('about1')}</p>
          <p>{this.props.t('about2')}</p>
          <p>{this.props.t('about3')}</p>
        </Content>
        <Footer/>
      </Container>
    );
  }

}

const Container = styled.div``;
const Content = styled.div`
  padding: 20px;
  font-size: 18px;
  line-height: 24px;
  min-height: 80vh;
  color: #999999;
  h1 {
    font-weight: 800;
    font-size: 20px;
    line-height: 26px;
    letter-spacing: 0.02em;
    color: ${props => props.theme.palette.blue};
  }
`;
export default withTranslation('common')(Index)

