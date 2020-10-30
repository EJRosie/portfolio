/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import LanguageSwitch from './language-switch';

export default class HeaderComponent extends React.Component {

  render() {
    return (
      <Header position="static" color="primary">
        <HeaderBar>
          <a href={"/"}><img src={"/static/images/Logo_Full.png"}/></a>
          <LanguageSwitch/>
        </HeaderBar>
      </Header>
    );
  }
}

const Header = styled(AppBar)`
  && {
    box-shadow: none;
  }
`;
const HeaderBar = styled(Toolbar)`
  && {
    justify-content: space-between;
    img {
      width: 90%;
    }
  }
`;

