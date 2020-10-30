/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import { i18n, Link, withTranslation } from '../../../i18n'
import styled from 'styled-components';
import ReCAPTCHA from "react-google-recaptcha";
import Router from 'next/router'
import {CardElement, injectStripe} from 'react-stripe-elements';
import {TextField, InputAdornment, Button, Checkbox, FormControlLabel, Radio, RadioGroup, CircularProgress} from '@material-ui/core/';
import ReactGA from 'react-ga';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.props.onChange;
    this.state = {
      error: "",
      showOtherTip: false
    }
    this.recaptchaRef = React.createRef();
  }

  render() {
    const {state} = this.props;
    return (
      <Container>

        <CreatorInfo>
          <CreatorIcon src={state.image}/>
          <CreatorInfoRight>
            <p>{state.nickname}</p>
            <p>{this.props.t('acceptFooterDesctiption')}</p>
          </CreatorInfoRight>
        </CreatorInfo>

        <ConfirmationText><span>{this.props.t('yourRequest')}: </span>{state.details}</ConfirmationText>
        <ConfirmationText><span>{this.props.t('yourName')}: </span>{state.for}</ConfirmationText>
        <ConfirmationText><span>{this.props.t('yourLine')}: </span>{state.line}</ConfirmationText>
        <ConfirmationText><span>{this.props.t('price')}: </span>{state.price / 100}฿</ConfirmationText>
        <SectionTitle>{this.props.t('leaveTip')}</SectionTitle>
        <Switch>
          <SwitchButton active={state.tip == 0 && !this.state.showOtherTip} onClick={() => this.changeTip(0)}>{this.props.t('noTip')}</SwitchButton>
          <SwitchButton active={state.tip == 5000 && !this.state.showOtherTip} onClick={() => this.changeTip(5000)}>50฿</SwitchButton>
          <SwitchButton active={state.tip == 20000 && !this.state.showOtherTip} onClick={() => this.changeTip(20000)}>200฿</SwitchButton>
          <SwitchButton active={state.tip == 50000 && !this.state.showOtherTip} onClick={() => this.changeTip(50000)}>500฿</SwitchButton>
          <SwitchButton active={!!this.state.showOtherTip} onClick={() => this.changeTip(0, true)}>{this.props.t('other')}</SwitchButton>
        </Switch>
        {
          this.state.showOtherTip && (
          <Input 
            id="details" placeholder={this.props.t('amount')} margin="dense" variant="outlined"
            onChange={(e) => this.changeTip(Number(e.target.value) * 100, true)}
            InputProps={{startAdornment: <strong>฿</strong>}}
          />
          )
        }
        <Section className="checkout">
        <SectionTitle> 
          {/*<i className={"fas fa-lock"}></i> */}{this.props.t('payment')} 
          <RadioContainer
            aria-label="card or transfer"
            value={this.props.value}
            onChange={this.handleChange('paymentType')}
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
            <TransferTitle>{this.props.t('transferTitle', {price: (state.price + state.tip) / 100})}:</TransferTitle>
            <SectionSubtitle>{this.props.t('bankName')}: <span>SCB</span></SectionSubtitle>
            <SectionSubtitle>{this.props.t('bankAccNum')}: <span>3762529673</span></SectionSubtitle>
            <SectionSubtitle>{this.props.t('reciptientName')}: <span>Sasiwan Wongbubpa</span></SectionSubtitle>
            <SectionSubtitle>{this.props.t('confrimPayment')}: <span>{this.props.t('sendReceiptA')} <a href="http://nav.cx/fGe36Wd">@bdazzle</a> {this.props.t('sendReceiptB')}</span></SectionSubtitle>
            </>
          )}
        <ErrorText>{this.state.error}</ErrorText>
        </Section>

          <BuyButton onClick={() => this.submit()} disabled={false} variant={"contained"} color="primary">{this.state.submitting ? <ProgressIndicator /> : <>{state.paymentType == 'card' ? <><i className={"fas fa-lock"}></i> {this.props.t('pay')}</> : this.props.t('iHavePaid')} {(state.price + state.tip) / 100}฿</> }</BuyButton>
        {state.paymentType == 'card' && <SecurePayments>{this.props.t('securePaymentsA')} <span>{this.props.t('securePaymentsB')}</span></SecurePayments>}
      </Container>
    );
  }
  changeTip(amount, other=false) {
    ReactGA.event({
      category: 'Payment Event',
      action: 'Changed Tip',
      label: other ? "other" : amount.toString(),
      nonInteraction: true
    });
    this.props.changeState("tip", Number(amount));
    this.setState({showOtherTip: other});
  }

  submit = async (ev) => {
    this.setState({submitting: true});
    this.recaptchaRef.current.execute();
    const personName = "User";
    const {state} = this.props;
    var data = {};
    data.creator = state.name;
    data.for = state.for;
    data.price = state.price;
    data.tip = state.tip;
    data.total = state.price + state.tip;
    data.details = state.details;
    data.line = state.line;
    data.paymentType = state.paymentType;
    data.public = state.public;
    data.token = null;
    if(this.props.state.paymentType == "transfer") {
      await fetch("/charge", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0; 
      return Router.push({
        pathname: '/confirmation',
        as: "/confirmation",
        query: data,
      });
    }
    let tokenResponse = await this.props.stripe.createToken({name: personName});
    if(!!tokenResponse.error) {
      return this.setState({error: tokenResponse.error.message, submitting: false});
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
      return Router.push({
        pathname: '/confirmation',
        as: "/confirmation",
        query: data,
      });
    }
    else {
      this.setState({error: response.statusText, submitting: false});
    }
  }

  packageInformation() {
    const {state} = this.props;
    const data = state;
    data.creator = this.props.creator;
  }
}
const ProgressIndicator = styled(CircularProgress)`
  && {
    color: ${props => props.theme.palette.blue};
    width: 25px;
    height: 25px;
  }
`;
const SwitchButton = styled(Button)`
  && {
    border-radius: 0;
    flex: 1;
    text-transform: capitalize;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.02em;
    padding: 4px;
    min-width: unset;
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
const SecurePayments = styled.p`
  color: ${props => props.theme.palette.text.dark};
  text-align: center;
  margin: 0;
  font-size: 16px;
  span {
    display: block;
  }
`;
const Switch = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
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
const ConfirmationText = styled.p`
  span {
    color: ${props => props.theme.palette.text.dark};
    font-weight: bold;
  }
  margin: 5px 0;
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
  margin-bottom: 20px;
`;
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
    i {
      margin-right: 8px;
    }
  }
`;
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
  background: ${props => props.theme.palette.background.white};
  ${props => props.theme.flex.column.start}
  align-items: stretch;
  flex: 1;
  margin-bottom: 20px;
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
const StripeContainer = styled.div`
  width: 100%;
  margin: 10px 0px;
  border: 1px solid #8AD8A3;
  border-radius: 4px;
`;
export default injectStripe(withTranslation('checkout')(CheckoutForm));
