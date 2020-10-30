import React from 'react';
import { i18n, Link, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import {Button, IconButton, TextField, FormControlLabel, Checkbox} from '@material-ui/core';

class RequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.props.onChange;
  }

  render() {
    const {state} = this.props;
    return (
    <CheckoutContainer>
      <CreatorInformation>
        <CreatorIcon src={state.image}/>
        <div>
          <Name>{state.nickname} <i className="fas fa-check-circle"></i></Name>
            <p>{state.ratings} {this.props.t('ratings')}</p>
            <span>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            <i className="fas fa-star"></i>
            5 {this.props.t('stars')}
            </span>
        </div>
      </CreatorInformation>
      <Message>
        <Title>{this.props.t('requestFrom')} {state.nickname}</Title>
        <span>{this.props.t('requestInfo', {name: state.nickname})}</span>
      </Message>

      <Input
        id="details" placeholder={this.props.t('questionOrRequest')} margin="dense" multiline variant="outlined" rows={3}
        onChange={this.handleChange('details')}
        value={state.details}
        helperText={<HelperText>{`${state.details.length}/250`}</HelperText>}
      />
      <Input
        id="your-name" placeholder={this.props.t('yourName')} margin="dense" variant="outlined"
        value={state.for}
        onChange={this.handleChange('for')}
      />
      <Input
        id="your-line" placeholder={this.props.t('yourLine')} margin="dense" variant="outlined"
        value={state.line}
        onChange={this.handleChange('line')}
      />

      <CheckboxContainer
        control={
        <StyledCheckBox
          checked={!state.public}
          onChange={() => this.props.changeState('public', !state.public)}
          value="makePublic"
          color="primary"
        />}
        label={`${this.props.t('makePublic')}`}
      />
      <InfoLine><span>{this.props.t('price')}</span> {state.price / 100}฿</InfoLine>
      <BuyButton onClick={() => this.props.onContinue()} disabled={!this.canRequest()} variant="contained" color="primary" >{this.props.t('continueToPayment')}</BuyButton>
      <QuestionsLine>{this.props.t('questions?')} <a>@bdazzle</a></QuestionsLine>
      </CheckoutContainer>
    );
  }
  canRequest() {
    const {state} = this.props;
    return state.for.length > 0 && state.details.length > 0 && state.line.length > 0;
  }
}

const QuestionsLine = styled.p`
  margin: 0;
  font-size: 16px;
  width: 100%;
  text-align: center;
  a {
    color: ${props => props.theme.palette.primary.dark};
  }
`;
const InfoLine = styled.p`
  margin: 0;
  color: ${props => props.theme.palette.text.dark};
  span {
    font-weight: bold; 
    color: ${props => props.theme.palette.text.dark};
  }
`;
const Input = styled(TextField)`
  && {
    fieldset {
      border: 1px solid #8AD8A3;
    }
    input {
      padding: 10px;
    }
    width: 100%;
  }
`;
const CheckboxContainer = styled(FormControlLabel)`
  &>span:last-child {
    color: ${props => props.theme.palette.text.dark} !important;
  }
`;
const StyledCheckBox = styled(Checkbox)`
  && {
    color: ${props => props.theme.palette.primary.dark} !important;
  }
`;
const CheckoutContainer = styled.div`
  background-color: ${props => props.theme.palette.background.white};
  padding: 10px;
  margin-bottom: 20px;
`;
const CreatorIcon = styled.img`
  border-radius: 100px;
  width: 100px;
  height: 100px;
`;
const HelperText = styled.span`
  text-align: right;
  display: block;
`;
const Title = styled.h2`
  margin: 0;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0.02em;
  color: ${props => props.theme.palette.text.dark};
`;
const Message = styled.div`
  margin 15px 0;
  color: #999999;
  font-size: 16px;
  line-height: 24px;
`;
const CreatorInformation = styled.div`
  width: 100%;
  color: ${props => props.theme.palette.text.light};
  font-weight: normal;
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.05em;
  ${props => props.theme.flex.row.start}
  &>div:last-child {
    align-self: stretch;
    margin-left: 10px;
    ${props => props.theme.flex.column.around}
    align-items: flex-start;
    span {
      color: ${props => props.theme.palette.text.dark};
      i {
        color: #FFD600;
      }
    }    
  }
  p {
    color: ${props => props.theme.palette.text.black}
    margin: 0;
  }
  
`;
const Name = styled.h1`
  i {
    color: ${props => props.theme.palette.primary.main};
    margin-left: 10px;
  }
  color: ${props => props.theme.palette.text.black};
  font-weight: 800;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: 0.05em;
  margin: 0;
`;
const BuyButton = styled(Button)`
&& {
  width: 100%;
  padding: 5px;
  white-space: nowrap;
  height: 45px;
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.08em;
  color: white !important;
  margin-bottom: 10px;
  margin-top: 10px;
  background-color: ${props => props.theme.palette.primary.dark};
}
`;
export default withTranslation('profile')(RequestForm)