import React, { Component } from 'react';
import {Image} from 'react-native';
import { View, Icon } from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class StatusIcon extends React.Component {
  render() {
    return (
      <CircleView>
        <ColoredIcon type="FontAwesome5" solid color={this.props.color} name={this.props.icon} />
      </CircleView>
    );
  }
}
const ColoredIcon = styled(Icon)`
  color: ${props => props.color};
  font-size: 16px;
`;
const CircleView = styled.View`
  position: absolute;
  justify-content: center;
  align-items: center;
  padding: 2px;
  bottom: 0px
  right: 0px;
  border-radius: 10px;
  height: 20px;
  width: 20px;
  background-color: ${COLORS.TRUE_WHITE};
`;