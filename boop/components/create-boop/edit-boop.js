import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Container, Button, Text, Content, Drawer, Accordion, Icon, Item, Input, View} from 'native-base';
import {COLORS} from '../../../native-base-theme/variables/material';
import Header from '../common/header';
import * as Queries from '../../graphql-custom/boops/queries';
import * as AllQueries from '../../graphql/queries';
import * as FriendQueries from '../../graphql-custom/friends/queries';
import * as BoopListQueries from '../../graphql-custom/boops/queries';
import moment from 'moment';
import * as Mutations from '../../graphql-custom/boops/mutations';
import * as AllMutations from '../../graphql/mutations';
import Query from '../../api';
import PickGame from './parts/pick-game';
import PickTime from './parts/pick-time';
import PickFriends from './parts/pick-friends';
import AddGames from './add-game';
import { connect } from 'react-redux';
import {setPendingBoops, setScheduledBoops, updateSpecificBoopActive, AddSc } from '../../actions/boops';
import { setFriends } from '../../actions/friends';
import {  Image, RefreshControl, Keyboard } from "react-native";
import { StackActions } from 'react-navigation';

class CreateBoop extends React.Component {

  state = {
    games: this.props.games,
    chosenTime: 0,
    chosenGames: [],
    chosenFriends: this.props.navigation.getParam('preselectedFriendArray', []),
    customTime: null,
    boopTitle: "",
    boopId: "",
    refreshing: false,
    isOpenDrawer: false
    
  }

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

  componentDidMount(){ 
    Query(AllQueries.userRelationByUserIdIsFriend, {
      userToUserRelationUserId: this.props.user.id,
      isFriendBoopMutualCount:{ge: {isFriend: 1}},
      sortDirection: "DESC",
      filter: {
        isFriend: {eq: 1},
        isBlocked: {eq: 0}
      },
      limit: 20,
    }).then((res) => 
    {
    this.props.updateFriends(res.data.userRelationByUserIdIsFriend);
    const edit= this.props.navigation.getParam('edit', 'value');
    this.setState({customTime: edit.playtime,
        boopId: edit.id,
        boopTitle: edit.title!==null? edit.title : "",
    chosenTime: 4 });
    edit.invites.map((user, index) => this.handleFriendChange(user.invitee.id));
    
    edit.games.forEach(game => {
      this.clickGame(game.game.id);
      if (this.props.games.filter(g => g.id === game.game.id).length === 0) {
          this.setState({games: [game,...this.state.games]});
        }
      })
    }
);

  }

  onRefresh = () => {
    
    this.setState({refreshing: true });
    Query(FriendQueries.userRelationByUserIdIsFriend, {
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
    }
    );

    this.setState({ refreshing: false });
  };

  navigateToYourBoops = () => {
    this.props.navigation.navigate("Your Boops");
  }

  render() {
    return (
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
          title={"Edit Boop"}
          leftButton={
            <Button transparent onPress={() => this.navigateToYourBoops()}>
              <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
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
          >
          <BoopView>
              <PickGame games={this.state.games} chosenGames={this.state.chosenGames} openDrawer={this.openDrawer.bind(this)} clickGame={(game) => this.clickGame(game)}/>
              <PickTime chosenTime={this.state.chosenTime} changeTime={(time, custom) => this.setState({chosenTime: time, customTime: custom})}/>
              <PickFriends user={this.props.user} friends={this.props.friends} chosenFriends={this.state.chosenFriends} changeFriends={(friendID) => this.handleFriendChange(friendID)}/>
              <StyledAccordian
                dataArray={[0]}
                animation={true}
                expanded={true}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
              />
              </BoopView>
          </BoopContent>
          <BoopButton info disabled={this.state.chosenFriends.length < 1 || this.state.chosenGames.length < 1} onPress={() => this.updateBoop()}><BoopEm>Update Boop</BoopEm></BoopButton>
          <BoopButton info  onPress={() => this.deleteBoop()}><BoopEm>Delete Boop</BoopEm></BoopButton>

        </BoopContainer>
      </Drawer>
    );
  }

  renderHeader(item, expanded) {
    return <MoreOptions><MoreText>Add a message</MoreText><MoreIcon type="FontAwesome5" name={expanded ? "angle-up" : "angle-down"}/></MoreOptions>
  }
  renderContent = (item, expanded) => {
    return (
      <Item fixedLabel>
        <Input onChangeText={(text) => this.setState({boopTitle: text})} placeholder="Add a message (optional)"/>
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
    
    return false;
  }
  addGame=(game)=> {
    
    this.clickGame(game.id);
    if (this.state.games.filter(g => g.id === game.id).length === 0) {
      this.setState({games: [game,...this.state.games]});
    }
  }

  deleteBoop() {
    Query(Mutations.deleteBoop, { input: { id: this.state.boop.id } });
    this.setState({ modalVisible: false });
    this.props.deleteBoop(this.state.boop);

    var updatedBoop= {
      boop: this.state.boop
    }
    this.props.updateBoop(updatedBoop);
    this.props.updateSpecificBoopActive(updatedBoop);
    this.navigateToYourBoops();
  }

  updateBoop(){
    const playtime = this.getPlaytime();
    const edit = this.props.navigation.getParam('edit', 'value');
    Query(
      Mutations.updateBoopCustom,
      {
        boopId: this.state.boopId,
        title: this.state.boopTitle.length > 0 ? this.state.boopTitle : null,
        playtime: playtime,
        gameIds: this.state.chosenGames,
        inviteeIds: this.state.chosenFriends,
      }).then((res) => {
        this.props.updateSpecificBoopActive({boop: res.data.updateBoopCustom});
        const pushAction = StackActions.push({
          routeName: 'BoopDetails',
          params: { boop: res.data.updateBoopCustom, isFrom: "edit"}
        });
        this.props.navigation.dispatch(pushAction);
        //this.props.navigation.navigate("Your Boops", {edit: "edit", id: boopID});
        this.resetState();
      })
    // this.props.navigation.navigate("Your Boops");
  }

  getPlaytime() {
    if(this.state.chosenTime === 0) {
      return new Date();
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
      customTime: null
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
    updateSpecificBoopActive: (boop) => {
      dispatch(updateSpecificBoopActive(boop))
    },
    updateBoops: (boops) => {
      dispatch(setScheduledBoops(boops))
    },
    updateFriends: (friends) => {
      dispatch(setFriends(friends))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBoop);

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
const BoopView = styled.View`
  
  padding: 10px;
`;
const MoreText = styled.Text`
  font-weight: bold;
  line-height: 30px;
  font-size: ${wp('3.5%')};
`;
const MoreIcon = styled(Icon)`
  height: 30px;
  margin-left: 10px;
`;
const BoopContainer = styled(Container)``;
// Creating a boop, add in the playtime if its +15min
const IconView = styled(View)`
  margin-right: ${wp("1.2%")};
  ${props =>
    props.userImage!==null
      ? `border-color: blue;
    border-width: 2px;
    border-radius: 50px;`
      : ""}
`;
const IconImage = styled.Image`
  width: ${wp("7%")};
  height: ${wp("7%")};
  border-radius: 15px;
`;
