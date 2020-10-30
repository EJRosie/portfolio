/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import LanguageSwitch from '../common/language-switch';

class Index extends React.Component {

  render() {
    return (
      <Container>
        <Gradient></Gradient>
        <TopBar>
          <a href={"/"}><img src={"/static/images/Logo_Full.png"}/></a> 
          <div><LanguageSwitch/></div>
        </TopBar>
        <BotttomBar>
          <p>{this.props.t('splashMessageA')}<br/>{this.props.t('splashMessageB')}</p>
        </BotttomBar>
      </Container>
    );
  }

}
const Gradient = styled.span`
  display: block;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 27%, rgba(0, 0, 0, 0.6) 100%);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;
const Container = styled.div`
  padding: 20px;
  position: relative;
  ${props => props.theme.flex.column.between}
  color: ${props => props.theme.palette.text.white};
  background-size: cover;
  background-position-x: center;
  height: 60vh;
  background-color: ${props => props.theme.palette.secondary.main}
  background-image: url("/static/images/happygirl.png");
  &>div {
    z-index: 100;
  }
`;
const TopBar = styled.div`
  ${props => props.theme.flex.row.between}
  width: 100%;
  img {
    width: 90%;
  }
`;
const BotttomBar = styled.div`
  ${props => props.theme.flex.column.center}
  p {
    margin: 0;
    margin-bottom: 12px;
    font-weight: 800;
    font-size: 18px;
    line-height: 23px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.17em;
    text-transform: uppercase;
    span {
      display: block;
    }
  }
  i {
    color: ${props => props.theme.palette.primary.main};
    font-size: 32px;
  }
`;
const CallToAction = styled.div`
  font-weight: 600;
  font-size: 25px;
  line-height: 30px;
  letter-spacing: 0.03em;
  text-align: center;
  position: relative;
  top: 5vh;
`;

export default withTranslation("common")(Index);