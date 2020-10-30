/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import ReCAPTCHA from "react-google-recaptcha";

import AcceptFooter from './accept-footer';

import {CardElement, injectStripe} from 'react-stripe-elements';
import {TextField, InputAdornment, Button, Checkbox, FormControlLabel, Radio, RadioGroup} from '@material-ui/core/';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.props.onChange;
    this.state = {
      error: ""
    }
    this.recaptchaRef = React.createRef();
  }


  render() {
    const {state} = this.props;
    return (
      <Container>
        <IsGiftContainer>
          <SectionTitle>{this.props.t('whoIsThisVideoFor')}</SectionTitle>
          <Switch>
            <SwitchButton active={state.gift} onClick={() => this.props.changeState('gift', true)}>{this.props.t('forSomeoneElse')}</SwitchButton>
            <SwitchButton active={!state.gift} onClick={() =>this.props.changeState('gift', false)}>{this.props.t('forMe')}</SwitchButton>
          </Switch>
        </IsGiftContainer>
          <Input
            id="their-name" placeholder={`${!!state.gift ?  this.props.t('theirName') : this.props.t('yourName')}`} margin="dense" variant="outlined"
            onChange={this.handleChange('to')}
            InputProps={{startAdornment: state.gift && <InlineLabel position="start">{this.props.t('to')}:</InlineLabel>}}
          />
          {!!state.gift && <Input
            id="your-name" placeholder={this.props.t('yourName')} margin="dense" variant="outlined"
            onChange={this.handleChange('from')}
            InputProps={{startAdornment: <InlineLabel position="start">{this.props.t('from')}:</InlineLabel>}}
          />}
          <Input
            id="details" placeholder={this.props.t('detailsPlaceholder', {name: this.props.creator.name})} margin="dense" multiline variant="outlined" rows={8}
            onChange={this.handleChange('details')}
            helperText={<HelperText>{`${state.details.length}/250`} {this.props.t('limit')}</HelperText>}
          />
          <Section>
            <SectionTitle>{this.props.t('whereSend')}</SectionTitle>
            <SectionSubtitle>{this.props.t('selectOne')}</SectionSubtitle>
            <Input
              id="email" placeholder={this.props.t('email')} margin="dense" variant="outlined"
              onChange={this.handleChange('email')}
            />
            <Input
              id="Line" placeholder={this.props.t('lineApp')} margin="dense" variant="outlined"
              onChange={this.handleChange('line')}
            />
            <CheckboxContainer
              control={
                <StyledCheckBox
                  checked={state.makePublic}
                  onChange={() => this.props.changeState('makePublic', !state.makePublic)}
                  value="makePublic"
                  color="primary"
                />
              }
              label={`${this.props.t('makePublic', {name: this.props.creator.name})}`}
            />
          </Section>
          <Section className="checkout">
          <SectionTitle> 
            <i className={"fas fa-lock"}></i> {this.props.t('payment')} 
            <RadioContainer
              aria-label="card or transfer"
              value={this.props.value}
              onChange={this.handleChange("paymentType")}
            >
              <FormControlLabel value="card" control={<Radio checked={state.paymentType == "card"} color="default"/>} label={this.props.t('creditDebit')} />
              <FormControlLabel value="transfer" control={<Radio checked={state.paymentType == 'transfer'} color="default"/>} label={this.props.t('bankTransfer')} />
            </RadioContainer> 
            </SectionTitle>
          
            {state.paymentType == "card" ? (
              <StripeContainer>
                <StyledCardElement /> 
              </StripeContainer>
            )
            : (
              <>
              <TransferTitle>{this.props.t('transferTitle', {price: this.props.creator.price / 100})}:</TransferTitle>
              <SectionSubtitle>{this.props.t('bankName')}: <span>Bank Name</span></SectionSubtitle>
              <SectionSubtitle>{this.props.t('bankAccNum')}: <span>Bank Account Number</span></SectionSubtitle>
              <SectionSubtitle>{this.props.t('reciptientName')}: <span>Recipient Name</span></SectionSubtitle>
              <SectionSubtitle>{this.props.t('confrimPayment')}: <span>{this.props.t('sendReceiptA')} <a>@bdazzle</a> {this.props.t('sendReceiptB')}</span></SectionSubtitle>
              </>
            )}
          <ErrorText>{this.state.error}</ErrorText>
          <Invisible>
            <ReCAPTCHA
              ref={this.recaptchaRef}
              size="invisible"
              sitekey="6LdFO7QUAAAAAPjsx56wEzssY2HxSozTUFkrR3-h"
            />
          </Invisible>
          </Section>
          <AcceptFooter creator={this.props.creator} disabled={!this.canBuy()} payingByCard={state.paymentType == 'card'} accept={this.submit}/>
          <SectionSubtitle><span>{this.props.t('gotQuestions')} <a>@bdazzle</a></span></SectionSubtitle>
        </Container>
    );
  }

  canBuy() {
    const {state} = this.props;
    return  state.to.length > 0 && state.details.length > 0 && (
      /(.+)@(.+){2,}\.(.+){2,}/.test(state.email) ||
      !!state.line
    );
  }

  submit = async (ev) => {
    this.recaptchaRef.current.execute();
    const personName = "User";
    const {confirmation, gift, ...data} = this.props.state;
    data.price = this.props.creator.price;
    data.creator = this.props.creator.name;
    data.from = gift ? data.from : "";
    data.token = null;
    if(this.props.state.paymentType == "transfer") {
      await fetch("/charge", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0; 
      return this.props.changeState('confirmation', true);
    }
    let tokenResponse = await this.props.stripe.createToken({name: personName});
    if(!!tokenResponse.error) {
      return this.setState({error: tokenResponse.error.message});
    }
    data.token = tokenResponse.token.id;
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (response.ok) {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0; 
      this.props.changeState('confirmation', true);
    }
    else {
      this.setState({error: response.statusText});
    }
  }

  packageInformation() {
    const {state} = this.props;
    const data = state;
    data.creator = this.props.creator;
  }
}
const RadioContainer = styled(RadioGroup)`
  && {
    flex-direction: row;
  }
`;
const StyledCardElement = styled(CardElement)`
  padding: 15px 10px;
`;
const Invisible = styled.div`
  .grecaptcha-badge {
    bottom: -1000px !important;
  }
`;
const TransferTitle = styled.h3`
  margin-top: 5px;
  margin-bottom: 10px;
  color: ${props => props.theme.palette.text.dark};
  font-size: 18px;
`;
const ErrorText = styled.p`
  color: red;
`;
const Section = styled.div`
  margin-top: 10px;
`;
const Container = styled.div`
  padding: 20px;
  ${props => props.theme.flex.column.start}
  align-items: stretch;
  flex: 1;
  padding-bottom: 20px;
`;
const Input = styled(TextField)`
  && {
    fieldset {
      border: 1px solid #8AD8A3;
    }
    width: 100%;
  }
`;
const HelperText = styled.span`
  text-align: right;
  display: block;
`;
const IsGiftContainer = styled.div`
  ${props => props.theme.flex.column.start}
  align-items: flex-start;
`;
const SectionTitle = styled.h2`
  color: ${props => props.theme.palette.blue};
  font-weight: 800;
  font-size: 20px;
  line-height: 26px;
  margin: 5px 0px;
`;
const SectionSubtitle = styled(SectionTitle)`
  color: ${props => props.theme.palette.text.dark};
  font-size: 16px;
  line-height: 18px;
  margin: 1px 0px;
  span {
    font-weight: 500;
    color: #999999;
  }
  a {
    color: ${props => props.theme.palette.primary.dark};
  }
`;
const Switch = styled.div`
  width: 100%;
  display: flex;
`;
const StyledCheckBox = styled(Checkbox)`
  && {
    color: ${props => props.theme.palette.primary.dark} !important;
  }
`;
const StripeContainer = styled.div`
  width: 100%;
  margin: 10px 0px;
  border: 1px solid #8AD8A3;
  border-radius: 4px;
`;
const SwitchButton = styled(Button)`
  && {
    font-weight: bold;
    border-radius: 0;
    flex: 1;
    text-transform: capitalize;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.02em;
    box-shadow: none !important;
    color: ${props => props.active ? "white" : "#8AD8A3" } !important;
    background-color: ${props => props.active ? "#8AD8A3" : "white"} !important;
    border: ${props =>  "#8AD8A3"} 1px solid !important;
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
const InlineLabel = styled(InputAdornment)`
  && {color:  ${props => props.theme.palette.text.dark};}
`;

const CheckboxContainer = styled(FormControlLabel)`
  &>span:last-child {
    color: ${props => props.theme.palette.text.dark} !important;
  }
`;

export default injectStripe(withTranslation('checkout')(CheckoutForm));
