import React, { Component } from 'react';
import { Container,Footer, View, Button, Icon, Text, Badge } from 'native-base';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';

class CreateBoop extends React.Component {

  state={
    clicked: false,
  }

  navigateScreen(){    
    this.setState((state) => ({clicked: !state.clicked}), () => {
      this.props.navigation.navigate("Friends", {clicked: this.state.clicked})
    });
  }

  render() {
    return (
      <Button
      vertical
      badge
      active={this.props.navigation.state.index === 2}
      onPress={() => this.navigateScreen() }
    >
      {this.props.requests.length > 0 ? <Badge><Text>{this.props.requests.length}</Text></Badge> : <View style={{height:14}}></View>}
      <Icon style={{fontSize: 28}} type="FontAwesome5" name="users" />
      <Text style={{fontSize: 12}} >Friends</Text>
    </Button>
    );
  }

}

const mapStateToProps = (state) => {
  const { requests } = state.friends;
  const {user} = state.user;
  return { requests, user }
};

export default connect(mapStateToProps)(CreateBoop);