/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

class Creator extends React.Component {

  render() {
    return (
      <Container href={this.props.href}>
        <CreatorIcon src={this.props.src}>
          <span>{this.props.price || "250"}฿</span>
        </CreatorIcon>
        <Name>{this.props.name} <i className="fas fa-check-circle"></i></Name>
        <ViewButton href={this.props.href}> {this.props.t('view')} </ViewButton>
      </Container>
    );
  }
}

const Container = styled.a`
  text-decoration: none;
  display: block;
  width: 50%;
  padding: 10px;
  max-width: 200px;
  ${props => props.theme.flex.column.center}
`;
const Name = styled.h2`
  white-space: nowrap;
  i {
    color: ${props => props.theme.palette.primary.main};
    margin-left: 10px;
  }
  color: ${props => props.theme.palette.text.dark};
  font-size: 16px;
`;
const ViewButton = styled.a`
  text-decoration: none;
  text-transform: uppercase;
  width: 100%;
  height: 45px;
  color: white;
  background-color: ${props => props.theme.palette.primary.dark};
  font-size: 18px;
  letter-spacing: 0.12em;
  font-weight: bolder;
  border-radius: 10px;
  ${props => props.theme.flex.row.center}
  cursor: pointer;
  &:hover {
    background-color: white;
    border: ${props => props.theme.palette.primary.dark} 2px solid;
    color: ${props => props.theme.palette.primary.dark};
  }
`;
const CreatorIcon = styled.div`
  border-radius: 100px;
  width: 140px;
  height: 140px;
  background-image: url(${props => props.src});
  background-position: center;
  background-size: contain;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  span {
    background: rgba(0, 0, 0, 0.29);
    height: 30px;
    color: white;
    text-align: center;
    width: 100%;
    font-size: 14px;
    line-height: 18px;
    ${props => props.theme.flex.row.center}
    padding-bottom: 5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;
/*
const CreatorIcon = styled.img`
  border-radius: 100px;
  width: 140px;
  height: 140px;
`;
*/


export default withTranslation('common')(Creator)
