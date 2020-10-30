/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import {TextField, InputAdornment, Button, Checkbox, FormControlLabel} from '@material-ui/core/';

class AcceptContainer extends React.Component {
  render() {
    const {creator} = this.props;
    const realPrice = (creator.price || 25000) / 100;
    return (
        <Container>
          <CreatorInfo>
            <CreatorIcon src={creator.image}/>
            <CreatorInfoRight>
              <p>{creator.name}</p>
              <p>{this.props.t('acceptFooterDesctiption')}</p>
            </CreatorInfoRight>
          </CreatorInfo>
          <BuyButton onClick={() => this.props.accept()} disabled={this.props.disabled} variant={"contained"} color="primary">{this.props.payingByCard ? this.props.t('buyVideoFor') : this.props.t('iHavePaid')} {realPrice}฿</BuyButton>
        </Container>
    );
  }
}
const BuyButton = styled(Button)`
  && {
    width: 100%;
    height: 45px;
    box-shadow: none;
    color: white;
    font-weight: 800;
    font-size: 20px;
    line-height: 26px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background-color: ${props => props.theme.palette.primary.dark};
  }
`;
const CreatorIcon = styled.img`
  border-radius: 100px;
  width: 45px;
  height: 45px;
`;
const CreatorInfoRight = styled.div`
  margin-left: 15px;
  p {
    margin: 0;
  }
  color: ${props => props.theme.palette.text.dark};
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.05em;
  p:first-child {
    color: ${props => props.theme.palette.text.black};
    font-weight: 800;
    font-size: 18px;
    line-height: 23px;
    letter-spacing: 0.05em;
  }
`;
const CreatorInfo = styled.div`
  ${props => props.theme.flex.row.start}
  width: 100%;
  margin-bottom: 10px;
`;
const Container = styled.div`
  max-height: 130px;
  ${props => props.theme.flex.column.between}
  position: static;
  background: white;
  max-width: 800px;
  bottom: 40px;
  right: 0;
  left: 0;
  width: 100%;
  margin: 15px 0;
  margin-bottom: 30px;
`;

export default withTranslation('checkout')(AcceptContainer)