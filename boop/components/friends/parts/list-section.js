import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Text } from 'native-base';

export default class ListSection extends React.Component {
  render() {
    return (
      <>
      {this.props.title &&
        <ListItem style={{borderBottomWidth: 0}}>
          <Text style={{color: "#813AC2", fontFamily: 'montserrat-semibold'}}>{this.props.title}</Text>
        </ListItem>
      }
        {React.Children.map(this.props.children, (child, i) => {
          return (
            <ListItem noIndent noBorder={React.Children.count === 1} style={{borderBottomWidth: 0}}>
              {child}
            </ListItem>
          );
        })}
      </>
    );
  }
}