import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, Text, View} from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import {TouchableOpacity, Image, ScrollView} from 'react-native';
import PickHeader from './pick-header';


export default class PickTime extends React.Component {
  state={
    chosenTime: 0,
    customPicker: false,
    customDate: null,
  }
  showDateTimePicker = () => {
    this.setState({ customPicker: true });
  };

  hideDateTimePicker = () => {
    this.setState({ customPicker: false });
  };

  handleDatePicked = date => {
    this.setState({customDate: date, customPicker: false});
    this.changeTime(4, date);
  };
  render() {
    return (
      <PickContainer>
        <PickHeader
          number={2}
          title={"Pick a time"}
        >
            {this.state.customDate && this.state.chosenTime == 4 &&
            <TimeText>( 
              {moment(this.state.customDate).calendar(null,{
                lastDay : '[Yesterday]',
                sameDay : '[Today] [at] HH:MM',
                nextDay : '[Tomorrow] [at] HH:MM',
                lastWeek : 'ddd, MMM Do [at] HH:MM',
                nextWeek : 'ddd, MMM Do [at] HH:MM',
                sameElse : 'ddd, MMM Do [at] HH:MM',
              })} )
              </TimeText>
            }
        </PickHeader>
        <Middle>
          {this.renderTime("Now", 0)}
          {this.renderTime("In 15 min", 1)}
          {this.renderTime("In 30 min", 2)}
          {this.renderTime("In 1 hour", 3)}
          {this.renderTime("...", 4, this.showDateTimePicker)}
        </Middle>
        <DateTimePicker
          mode={'datetime'}
          minimumDate={new Date()}
          date={this.state.customDate || new Date()} 
          isVisible={!!this.state.customPicker}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </PickContainer>
    );
  }

  renderTime(name="Now", index, customFunc) {
    const isActive = index == this.props.chosenTime;
    return (
      <TimeContainer index={index} small={!!customFunc} active={isActive} onPress={() => {if(!!customFunc) {return customFunc()} this.changeTime(index)}}>
        <TimeText active={isActive} numberOfLines={1} style={{fontSize: 11, flexWrap: 'nowrap'}}>{name}</TimeText>
      </TimeContainer>
    );
  }
  changeTime(time, date=null) {
    this.setState({chosenTime: time});
    this.props.changeTime(time, date);
  }
}
const TimeContainer = styled.TouchableOpacity`
  ${props => props.small ? "width: 32px;" : "flex-basis: 20%;"}
  justify-content: space-around;
  align-items: center;
  margin-right: 2px;
  border-color: ${props => props.active ? COLORS.PRIMARY : COLORS.GREY};
  background-color: ${props => props.active ? COLORS.PRIMARY : "transparent"};
  border-width: 2px;
  border-radius: 20px;
  height: 32px;
`;
const TimeText = styled.Text`
  font-family: gotham;
  font-size: 12px;
  color: ${props => props.active ? COLORS.WHITE : COLORS.PRIMARY};
`;
const PickContainer = styled.View`
  margin-top: 20px;
  flex: 1;
  margin-bottom: 20px;
`;
const Middle = styled.View`
  margin-top: 30px;
  flex-direction: row;
  justify-content: space-between;
`;