/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { Friend } from 'react-line-social';

class Footer extends React.Component {

  render() {
    return (
      <StyledFooter>
        <TopBar></TopBar>
        <MidBar>
          <p>{this.props.t('footerTextA')} <a href={"mailto:contact@bdazzle.me"}>{this.props.t('footerTextB')}</a> {this.props.t('footerTextC')} <a>@bdazzle</a></p>
          <LineButton><img src="/static/images/add_on_line.png" alt="Add On Line" height="30" border="0"/></LineButton>
        </MidBar>
        <BotBar>
          © 2019 bdazzle
        </BotBar>
      </StyledFooter>
    );
  }
}
const StyledFooter = styled.div`
  height: auto;
  min-height: 110px;
  width: 100%;
  ${props => props.theme.flex.column.between}
  align-items: stretch;
  background-color: ${props => props.theme.palette.background.footer};
  padding: 5px 20px;
`;
const LineButton = styled.a`
  border-radius: 10px;
`;
const TopBar = styled.div`
`;
const MidBar = styled.div`
  ${props => props.theme.flex.row.between}
  p { margin: 0; color: ${props => props.theme.palette.text.dark};}
  p>a {
    color: ${props => props.theme.palette.primary.dark};
    text-decoration: none;
    $:hover {
      text-decoration: none;
    }
  }
  margin: 0;
`;
const BotBar = styled.p`
  margin: 0;
  font-size: 14px;
  color:${props => props.theme.palette.text.light};
`;
const Link = styled.a`
  font-weight: bold;
  color: ${props => props.theme.palette.primary.dark};
  text-decoration: none;
  $:hover {
    text-decoration: none;
  }
  margin-right: 15px;
`;

export default withTranslation('common')(Footer)
