import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Container, Button, Text, Content, Drawer, Accordion, Icon, Item, Input, View, Toast, Root} from 'native-base';
import {COLORS} from '../../../native-base-theme/variables/material';
import Header from '../common/header';
import * as Queries from '../../graphql-custom/boops/queries';
import * as AllQueries from '../../graphql/queries';
import * as BoopListQueries from '../../graphql-custom/boops/queries';
import * as SearchQueries from '../../graphql-custom/search/queries';
import * as FriendQueries from '../../graphql-custom/friends/queries';
import moment from 'moment';
import * as Mutations from '../../graphql-custom/boops/mutations';
import * as AllMutations from '../../graphql/mutations';
import Query from '../../api';
import PickGame from './parts/pick-game';
import PickTime from './parts/pick-time';
import PickFriends from './parts/pick-friends';
import AddGames from './add-game';
import { connect } from 'react-redux';
import {addMoreScheduled, setScheduledBoops} from '../../actions/boops';
import { setGames } from '../../actions/user';
import {TouchableOpacity} from 'react-native';
import { setFriends } from '../../actions/friends';
import { RefreshControl, Keyboard, ActivityIndicator, KeyboardAvoidingView, Share } from "react-native";
import CachedImage from "../cached-image";
import { StackActions } from 'react-navigation';
import { LinearGradient } from 'expo-linear-gradient';


class CreateBoop extends React.Component {
  state = {
    games: this.props.games,
    chosenTime: 0,
    chosenGames: [],
    chosenFriends: this.props.navigation.getParam('preselectedFriendArray', []),
    customTime: null,
    boopTitle: "",
    refreshing: false,
    isOpenDrawer: false,
    boopLoading: false,
  }
  scroll = React.ref;
  closeDrawer() { 
    this.setState({isOpenDrawer: false})
    Keyboard.dismiss()
    this._drawer._root.close() 
  }
  openDrawer() {
    const pushAction = StackActions.push({
      routeName: 'AddGame',
      params: {addGame: (game) => this.addGame(game)}
    });
    this.props.navigation.dispatch(pushAction);
    // this.setState({isOpenDrawer: true})
    // this._drawer._root.open() 
  }
  componentDidUpdate(prevProps) {
    if(this.props.navigation.getParam('preselectedFriendArray', []) != prevProps.navigation.getParam('preselectedFriendArray', []) && this.props.navigation.getParam('preselectedFriendArray', []).length > 0) {
      this.handleFriendChange(this.props.navigation.getParam('preselectedFriendArray', [])[0], true)
    }
  }
  openProfile(){
    const pushAction = StackActions.push({
      routeName: 'Profile',
      params: {from : "new"}
    });
    this.props.navigation.dispatch(pushAction);
  }
  
  onRefresh = () => {
    
    this.setState({refreshing: true });
    Query(AllQueries.userRelationByUserIdIsFriend, {
      userToUserRelationUserId: this.props.user.id,
      isFriendBoopMutualCount:{ge: {isFriend: 1}},
      sortDirection: "DESC",
      filter: {
        isFriend: {eq: 1},
        isBlocked: {eq: 0}
      },
      limit: 20,
    }).then((res) =>{
     this.props.updateFriends(res.data.userRelationByUserIdIsFriend);
     this.setState({ refreshing: false });
    });

    this.setState({ refreshing: false });
 };

  onScrollBeginDrag = () => {
    Keyboard.dismiss();
  }

  render() {
    return (
      <Root>
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
      <Drawer 
        ref={(ref) => { this._drawer = ref; }} 
        content={this.state.isOpenDrawer&&<AddGames addGame={this.addGame.bind(this)} onBackButton={this.closeDrawer.bind(this)}/>} 
        onClose={() => this.closeDrawer()}
        openDrawerOffset={0}
        panCloseMask={0}
        side={'right'}
        tapToClose={false}
      >
        <BoopContainer>
        <Header
          scrollRef={this.scroll}
          leftButton={
            <Button transparent onPress={() => this.openProfile()}>
              <IconView self={this.props.self}>
                <IconImage
                  s3Image={this.props.user.profilePicture}
                  preview={require("../../../assets/images/Avatar.png")}/>
              </IconView>
            </Button>
          }
          />
          <BoopContent
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
          }
          removeClippedSubviews={false}
          innerRef={ref => {this.scroll = ref}}
          onScrollBeginDrag={this.onScrollBeginDrag}
          >
          <BoopView>
            <PickGame games={this.state.games} chosenGames={this.state.chosenGames} openDrawer={this.openDrawer.bind(this)} clickGame={(game) => this.clickGame(game)}/>
            <PickTime chosenTime={this.state.chosenTime} changeTime={(time, custom) => this.setState({chosenTime: time, customTime: custom})}/>
            <PickFriends navigation={this.props.navigation} user={this.props.user} friends={this.props.friends} chosenFriends={this.state.chosenFriends} changeFriends={(friendID) => this.handleFriendChange(friendID)}/>
            <StyledAccordian
              dataArray={[0]}
              animation={true}
              expanded={true}
              renderHeader={this.renderHeader}
              renderContent={this.renderContent}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                if(this.scroll) {this.scroll.scrollTo({x: 0, y: 0, animated: true});}
              }}
              onAccordionOpen={() => {
                console.log(this.scroll)
              }}
            />
          </BoopView>
          </BoopContent>
          <FirstBoopButton
                primary
                bordered
                rounded
                block
                large
                disabled={this.state.chosenFriends.length < 1 || this.state.chosenGames.length < 1} 
                onPress={() => this.createBoop()}
              >

                <Text>Send Boop</Text>
              </FirstBoopButton>
        </BoopContainer>
      </Drawer>
      </KeyboardAvoidingView>
      </Root>
    );
  }

  renderHeader(item, expanded) {
    return <MoreOptions><MoreTextBold>Add a message</MoreTextBold><MoreText> (optional)</MoreText><MoreIcon type="FontAwesome5" name={expanded ? "angle-up" : "angle-down"}/></MoreOptions>
  }

  renderContent = (item, expanded) => {
    return (
      <Item fixedLabel>
        <Input value={this.state.boopTitle} onChangeText={(text) => this.setState({boopTitle: text})} placeholder="Your message" returnKeyType="done"/>
        {this.state.boopTitle!="" &&
          <Icon
            style={{ color: COLORS.LIGHT_GREY }}
            type="FontAwesome5"
            name="times-circle"
            onPress={()=>this.setState({boopTitle: ""})}
          />}
      </Item>
    );
  }

  handleFriendChange(friendID, noRemove=false) {
    if(this.state.chosenFriends.includes(friendID)) {
      if(noRemove) {return;}
      const arrayWithoutFriend = this.state.chosenFriends.filter(x => x != friendID);
      return this.setState({chosenFriends: arrayWithoutFriend});
    }
    this.setState({chosenFriends: [...this.state.chosenFriends, friendID]});
  }

  clickGame(gameID) {
    if(this.state.chosenGames.includes(gameID)) {
      const arrayWithoutGame = this.state.chosenGames.filter(x => x != gameID);
      return this.setState({chosenGames: arrayWithoutGame});
    }
    if(this.state.chosenGames.length < 5) {
      return this.setState({chosenGames: [...this.state.chosenGames, gameID]});
    }
    Toast.show({
      text: `You can only select up to 5 games.`,
      buttonText: ''
    })
    return false;
  }
  addGame=(game)=> {
    
    this.clickGame(game.id);
    if (this.state.games.filter(g => g.id === game.id).length === 0) {
      this.setState({games: [game,...this.state.games]});
    }
  }

  createBoop(){
    this.setState({boopLoading: true});
    inviteeIds = this.state.chosenFriends.filter(num => num != -1);
    const playtime = this.getPlaytime();
    Query(
      Mutations.createBoopCustom,
      {
        title: this.state.boopTitle.length > 0 ? this.state.boopTitle : null,
        playtime: playtime,
        gameIds: this.state.chosenGames,
        inviteeIds
      }
    ).then((res) => {
      if(this.state.chosenFriends.includes(-1)) {
        const shareId = res.data.createBoopCustom.shareId;
        Share.share({
          message:
            `Hey! Want to play https://boop.gg/boop/${shareId}`,
        });
        console.log(shareId);
      }
      let boops = {items: [{boop: res.data.createBoopCustom}]}
      this.props.addMoreBoops(boops);
      this.props.navigation.navigate("Your Boops", {newBoop: true})
      this.resetState();
    }).catch((err) => console.log(err));
  }

  getPlaytime() {
    if(this.state.chosenTime === 0) {
      return null;
    }
    if(this.state.chosenTime === 1) {
      return new Date(new Date().getTime() + 15*60000);
    }
    if(this.state.chosenTime === 2) {
      return new Date(new Date().getTime() + 30*60000);
    }
    if(this.state.chosenTime === 3) {
      return new Date(new Date().getTime() + 60*60000);
    }
    return this.state.customTime;
  }

  resetState() {
    this.setState({
      games: this.props.games,
      chosenTime: 0,
      chosenGames: [],
      chosenFriends: [],
      customTime: null,
      boopLoading: false,
      refreshing: false
    })
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    friends: state.friends.friends,
    games: state.user.games,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateBoops: (boops) => {
      dispatch(setScheduledBoops(boops))
    },
    updateFriends: (friends) => {
      dispatch(setFriends(friends))
    },
    addMoreBoops: (boops) => {
      dispatch(addMoreScheduled(boops))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoop);

const Bold = styled.Text`
  font-family: montserrat-bold;
`;
const StyledAccordian = styled(Accordion)`
  border: none;
`;
const BoopContent = styled(Content)`
  padding: 10px;
`;
const BoopButton = styled(Button)`
  border-radius: 100px;
  height: ${wp('16%')};
  justify-content: center;
  align-items: center;
  align-self: stretch;
  margin: 10px
`;
const BoopEm = styled.Text`
  color: ${COLORS.TRUE_WHITE};
  text-align: center;
  font-weight: bold;
  font-size: ${wp('5%')};
`;
const MoreOptions = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;
const FirstBoopButton = styled(Button)`
  margin: 20px;
  justify-content: center;
  align-self: stretch;
`;
const BoopView = styled.View`
  padding: 10px;
  padding-bottom: 30px;
`;
const MoreText = styled.Text`
  line-height: 30px;
  color: ${COLORS.PRIMARY};
  font-size: 16px;
  align-self: flex-start;
`;
const MoreTextBold = styled.Text`
  font-weight: bold;
  line-height: 30px;
  color: ${COLORS.PRIMARY};
  font-size: 16px;
  align-self: flex-start;
`;
const MoreIcon = styled(Icon)`
  height: 30px;
  margin-left: auto;
  color: #A3A3A3
`;
const BoopContainer = styled(Container)``;
// Creating a boop, add in the playtime if its +15min
const IconView = styled(View)`
  margin-right: ${wp("1.2%")};
`;
const IconImage = styled(CachedImage)`
  width: 48px;
  height: 48px;
  border-radius: 25px;
`;
