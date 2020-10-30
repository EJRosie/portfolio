/*
* counter.js is a single life counter for the MTGZero app.
* the Counter module consists of 4 parts:
*   1.    The NameInput, which displays the name of the player, and allows them to change the name as well
*   2.    The Life, which is a number displayed in the middle of the counter
*   3/4.  The + and - buttons, which allow the user to change the life of the player.
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image
} from 'react-native';
import styles from './styles.js';
import NameInput from './playerTileComponents/playerTileName.js';
import Dot from './playerTileComponents/cmdDmgDot.js';
export default class Counter extends Component {
    constructor(props){

      super(props);
      this.state = {
          life: 20,
          color: '#fff', //The default color is white, but it can be changed through the settings.
          name: ' ',
          rotate: '0', //The rotation of the counter can also be changed, and is unique to each player.
          scale: 1,
          type: this.props.type,
      }
  }
    componentDidMount() {
        this.getLife();
        this.getStyle();
    }
      render() {
            return (
                    <View style={[styles.playerTile, {backgroundColor: this.state.color}]}>
                    <View reload={this.props.reload} style={[styles.player , {transform: [{scale: this.state.scale}, {rotate: (this.state.rotate + 'deg')}]}]}>
                      <NameInput style={styles.counterName} playerNumber={this.props.playerNumber}/>
                      <View style={styles.counter}>
                        <TouchableOpacity onPress={() => this.sub(1)} delayLongPress={750} onLongPress={() => this.sub(10)}style={styles.sideButton}>
                          <Text style={styles.sideButtonText}> - </Text>
                        </TouchableOpacity>
                        <View style={styles.lifeCol}>
                          <Text style={[styles.life]}>{this.state.life}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.add(1)} delayLongPress={750} onLongPress={() => this.add(10)} style={styles.sideButton}>
                          <Text style={styles.sideButtonText}> + </Text>
                        </TouchableOpacity>
                      </View>
                      {this.getDots()}
                    </View>
                    </View>

            );
        }
    //Subtract num from the life total of the player.
    sub(num) {
        this.setLife(this.state.life-num);
        this.setState({life: this.state.life-num});
    }

    //Add num from the life total of the player.
    add(num) {
        this.setLife(this.state.life+num);
        this.setState({life: this.state.life+num});
    }

    //Get the life of the player when the app opens.
    getLife() {
        AsyncStorage.getItem(this.props.playerNumber + "Life").then((value) => {
             if(value != null)
             {this.setState({life: parseInt(value)});}
        }).done();
    }

    //Save the life to Async.
    setLife(num) {
        AsyncStorage.setItem(this.props.playerNumber + "Life", num.toString());
    }

    //Get the unique style of the player, which is saved to ASync
    getStyle() {
        AsyncStorage.getItem(this.props.playerNumber + "Color").then((value) => {
          if(value !== null) {this.setState({color: value});}
          else {this.setState({color: "white"});}
        }).done();
        AsyncStorage.getItem(this.props.playerNumber + "Name").then((value) => {
          if(value !== null) {this.setState({name: value});}
        }).done();
        AsyncStorage.getItem(this.props.playerNumber + "Orientation").then((value) => {
          if(value == '90' || value == '270' || value == '0' || value == '180') {
            this.setState({rotate: value});
            if (value == '90' || value == '270') { this.setState({scale: 0.8}); }
            else { this.setState({scale: 1}); }
          }
        }).done();
     
        this.getLife; //Then reset the counter to display the correct configuration
    }
    //When the game is in Commander mode, there needs to be a way to track damage from each other player.
    getDots() {
        if (this.props.type == "40") {
          var dots = [
              <Dot key={1} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={1}/>,
              <Dot key={2} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={2}/>,
              <Dot key={3} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={3}/>,
              <Dot key={4} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={4}/>,
              <Dot key={5} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={5}/>,
              <Dot key={6} reload={this.props.reload} counterNumber={this.props.playerNumber} playerNumber={6}/>,
          ]
          //To help remember which player is which, the dots are given the same colors the players are given.
          dots.splice(this.props.playerNumber - 1, 1);

          return (
             <View style={styles.cmdDotsContainer}>
              {dots}
             </View>
          );
        }
        else {
          return (
            <View style={styles.noncmdBuffer}> </View>
          );
        }
    }
}