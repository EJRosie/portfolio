/*
* menuBar.js
* This is the top menu bar for the life counter.
* the MenuBar component consists of 4 parts:
*   1. The Back button, which will pop the navigation stack.
*   2. The New Game button, which allows the user to choose what type of game to start.
*   3. The New Game Modal, which is the menu that pops up when the New Game button is clicked
*   4. The Settings Button, which takes the user to the settings page.
*/

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Navigator,
  Modal,
  TouchableHighlight,
  Button
} from 'react-native';
import styles from './styles.js';
import Settings from './gameSettings.js';


export default class menuBar extends Component {

      state = {
         menu: false,
      }

      render() {
            return (
                <View style={[styles.menuBar, this.props.style]}>
                <Modal
                  animationType={"fade"}
                  transparent={true}
                  visible={this.state.menu}
                  >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                    <Button
                        onPress={() => {this.setGame("20")}}
                        title="Normal Game"
                        style={styles.newGameButton}
                    />
                    <Button
                        onPress={() => {this.setGame("30")}}
                        title="Two-Headed Giant"
                        style={styles.newGameButton}
                    />
                    <Button
                        onPress={() => {this.setGame("40")}}
                        title="Commander"
                        style={styles.newGameButton}
                    />
                    <Button
                        onPress={() => {this.setState({menu: false})}}
                        title="Cancel"
                        color= '#000'
                        style={[styles.newGameButton]}
                    />

                      </View>
                    </View>
                 </Modal>

                 
                    <TouchableOpacity onPress={this.props.back} style={styles.menuBarButton}>
                        <Image resizeMode={'stretch'} source={require("./imgs/back.png")} style={styles.backIcon}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({menu: true})}} delayLongPress={750} onLongPress={() => {this.setGame(0)}} style={styles.newGame}>
                        <Text  style={styles.newGameText}>New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuBarButton} onPress={this.props.settings}>
                        <Image resizeMode={'stretch'} source={require("./imgs/cog.png")} style={styles.settingsIcon}/>
                    </TouchableOpacity>
                </View>
            );
        }

        //Restart the game with proper starting life.
        setGame(startingLife) {
            this.props.reload(startingLife);
            this.setState({menu: false});
        }

        //Button to go to settings.
        settings() {
            this.props.navigator.pop()
        }
}