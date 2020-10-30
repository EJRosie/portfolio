import React, { Component } from 'react';
import { View, Button, Icon, Text, Badge } from 'native-base';
import { connect } from 'react-redux';

class CreateBoop extends React.Component {
  state={
    clicked: false,
  }

  navigateScreen(){
    this.setState(state => ({clicked: !state.clicked}),
    () => {
      this.props.navigation.navigate("Your Boops", {clicked: this.state.clicked})
    });
  }

  render() {
    return (
      <Button
        vertical
        badge
        active={this.props.navigation.state.index === 0}
        onPress={() => this.navigateScreen()}
      >
        {this.props.pending.length > 0 ? <Badge><Text>{this.props.pending.length}</Text></Badge> : <View style={{height:14}}></View>}
        <Icon style={{fontSize: 28}} type="FontAwesome5" name="calendar" />
        <Text style={{fontSize: 12}}>My Boops</Text>
      </Button>
    );
  }

}

const mapStateToProps = (state) => {
  const { pending } = state.boops;
  const {user} = state.user;
  return { pending, user }
};

export default connect(mapStateToProps)(CreateBoop);