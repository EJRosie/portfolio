/*
* LifeCounter.js is the main page of the app. It allows users to keep track of their life total for games of Magic: the Gathering
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Navigator,
  AsyncStorage,
  Modal
} from 'react-native';
import styles from './styles.js';
import Counter from './counter.js';
import MenuBar from './menuBar.js';
import Settings from './gameSettings.js';
import SwipeableViews from 'react-swipeable-views-native';
import { 
  AdMobBanner, 
  AdMobInterstitial, 
  PublisherBanner,
  AdMobRewarded
} from 'react-native-admob'


export default class LifeCounter extends Component {
    constructor(props){

      super(props);
      this.state = {
          init: "20",
          reload: true,
          settings: false,
          ads: true,
      }
  }
      componentDidMount() {
          this.gameType();
          //this.adBool(); <= Future paid model.
      }
      render() {

            return (
                <View style={styles.gameBackground}>
                    <MenuBar style={styles.topMenuBar} reload={(value) => this.newGame(value)} settings={this.settings.bind(this)} back={this.back.bind(this)}/>
                    <SwipeableViews style={styles.slideContainer}>
                        <View style={styles.gameBackground}>
                            <Modal
                                animationType={"slide"}
                                transparent={true}
                                visible={this.state.settings}>
                                <Settings back={this.settings.bind(this)}/>
                            </Modal>
                            <Counter reload={this.state.reload} who={styles.opponent} playerNumber={2} type={this.state.init}/>
                            <Counter reload={this.state.reload} who={styles.me} playerNumber={1} type={this.state.init}/>
                        </View>
                        <View style={styles.gameBackground}>
                            <Modal
                                animationType={"slide"}
                                transparent={true}
                                visible={this.state.settings}>
                                <Settings back={this.settings.bind(this)}/>
                            </Modal>
                            <Counter reload={this.state.reload} who={styles.opponent} playerNumber={4} type={this.state.init}/>
                            <Counter reload={this.state.reload} who={styles.me} playerNumber={3} type={this.state.init}/>
                        </View>
                        <View style={styles.gameBackground}>
                            <Modal
                                animationType={"slide"}
                                transparent={true}
                                visible={this.state.settings}>
                                <Settings back={this.settings.bind(this)}/>
                            </Modal>
                            <Counter reload={this.state.reload} who={styles.opponent} playerNumber={6} type={this.state.init}/>
                            <Counter reload={this.state.reload} who={styles.me} playerNumber={5} type={this.state.init}/>
                        </View>
                    </SwipeableViews>
                  {this.getAd()}
                </View>
            );
        }

    newGame(startingLife) {
        //Reset life totals for each player.
        if (startingLife == 0) { startingLife = this.state.init; }
        else { this.setState({init: startingLife}); }
        AsyncStorage.setItem('gameType', startingLife);
        AsyncStorage.setItem(1 + "Life", startingLife);
        AsyncStorage.setItem(2 + "Life", startingLife);
        AsyncStorage.setItem(3 + "Life", startingLife);
        AsyncStorage.setItem(4 + "Life", startingLife);
        AsyncStorage.setItem(5 + "Life", startingLife);
        AsyncStorage.setItem(6 + "Life", startingLife);

        //Reset commander damage.
        for(var x = 1; x < 7; x++) {
            for(var y = 1; y < 7; y++) {
                AsyncStorage.setItem(x + "_dmgTo_" + y, "0");
            }
        }
        //Refresh App.
        this.setState({reload: !this.state.reload});
    }

    //Navigate to Settings page.
    settings() {
        this.props.navigator.push({
          component: Settings,
          props: {}
        });
    }

    //Back Button (Currently does not do anything because this is the first page).
    back() {
        this.props.navigator.pop()
    }

    //Changes the game type, and therefore starting life total.
    gameType() {
        AsyncStorage.getItem('gameType').then((value) => {
            if(value !== null)
            {this.setState({init: value});}
        }).done();


    }
    //Displays the Google AdMob ad.
    getAd() {
      return (
        <AdMobBanner
          adUnitID="AD-UNIT-ID"
          testDeviceID="EMULATOR"
          didFailToReceiveAdWithError={this.bannerError} />
      )
    }

    //Reloads this page when the settings are changed.
    closeSettings() {
        this.setState({settings: !this.state.settings});
        this.setState({reload: !this.state.reload});
    }

    //Function to hide ads for future paid model.
    adBool() {
      AsyncStorage.getItem('noAds').then((value) => {
            if(value == true)
            {this.setState({ads: false});}
        }).done();
    }
}
