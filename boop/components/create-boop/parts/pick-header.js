import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button, Text, View, Drawer} from 'native-base';
import {COLORS} from '../../../../native-base-theme/variables/material';


export default class PickGame extends React.Component {

  render() {
    return (
      <Container>
        <Left>
          <Number><NumberText>{this.props.number}</NumberText></Number>
          <TitleText style={{color: COLORS.PRIMARY}}>{this.props.title}</TitleText>
        </Left>
        {this.props.children}
      </Container>
    );
  }

}
const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Left = styled.View`
  flex-direction: row;
  align-items: center;
`;
const TitleText = styled.Text`
  font-family: montserrat-semibold;
  font-size: 16px;
  line-height: 18px;
`;
const Number = styled.View`
  background-color: ${COLORS.PRIMARY};
  border-radius: 50px;
  padding: 1px;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;
const NumberText = styled.Text`
  font-size: 14px;
  line-height: 17px;
  font-family: montserrat;
  color: ${COLORS.WHITE};
`;