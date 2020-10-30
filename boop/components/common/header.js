import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Container, Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';


export default class App extends React.Component {
  render() {
    return (
      <Header noShadow style={{paddingHorizotnal: 0}}>
        <Left style={{flex: 1, color: 'white'}}>
          {this.props.leftButton}
          {!!this.props.title && <TitleSpace></TitleSpace>}
          {!!this.props.title && this.renderTitle(this.props.title)}
        </Left>
          {!this.props.title && <Center>{this.renderTitle(this.props.title)}</Center>}
        <Right style={{flex: 1, paddingRight: 10}}>
          {!!this.props.rightButton ? this.props.rightButton : null}
        </Right>
      </Header>
    );
  }
  renderTitle(title) {
    if(title == null) {
      return <Title color={"white"}>boop</Title>
    }
    if(typeof title == 'string') {
      return <Title color={"white"}>{title}</Title>;
    }
    return title;
  }
}

const Center = styled(Body)`
  flex: 5;
  justify-content: center;
  text-align: center;
  align-items: center;
`;
const TitleSpace = styled.View`
  width: 18px;
`;