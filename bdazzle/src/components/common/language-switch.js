/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import {Button} from '@material-ui/core/';

export default class LanguageSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <SwitchButton shadow={!!this.props.shadow} active={i18n.language == "en"} onClick={() => this.changeLanguage("en")}>English</SwitchButton>
        <SwitchButton shadow={!!this.props.shadow} active={i18n.language != "en"} onClick={() => this.changeLanguage("th")}>ภาษาไทย</SwitchButton>
      </Switch>
    );
  }
  changeLanguage(lang) {
    if(lang == "en"){
      i18n.changeLanguage('en');
    }
    else {
      i18n.changeLanguage('th');
    }
  }
}


const Switch = styled.div`
  width: 100%;
  display: flex;
  max-width: 160px;
`;
const SwitchButton = styled(Button)`
  && {
    font-weight: bold;
    border-radius: 0;
    flex: 1;
    white-space: nowrap;
    text-transform: capitalize;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.02em;
    box-shadow: none !important;
    color: white;
    background-color: ${props => props.active ? "#8AD8A3" : "transparent"} !important;
    border: white 1px solid !important;
    ${props => props.shadow ? `text-shadow: 0px 0px 10px #00000077;` : ""}
    &:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
    }
    &:last-child {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
    }
  }
`;