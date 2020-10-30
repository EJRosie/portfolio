import React, { Component } from "react";
import { connect } from "react-redux";
import {
    Image,
    TouchableWithoutFeedback,
    View
} from "react-native";
import styled from "styled-components";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import {
    Container,
    Text,
    Button,
    Content,
    Icon,
    Root,
    Body,
    Toast
} from "native-base";
import Header from "../common/header";
import { Auth, Storage } from "aws-amplify";
import awsconfig from "../../aws-exports";
import * as Mutations from "../../graphql-custom/users/mutations";
import * as UserQueries from "../../graphql-custom/users/queries";
import * as FriendQueries from "../../graphql-custom/friends/queries";
import * as FriendsMutations from '../../graphql-custom/friends/mutations';
import * as BlockMutations from '../../graphql-custom/blocks/mutations';
import Query from "../../api";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import UserSections from "./myprofile-section";
import NotificationSettings from "./notification-setting";
import * as Permissions from "expo-permissions";
import { COLORS } from "../../../native-base-theme/variables/material";
var uuid = require("react-native-uuid");
import { addOutgoingRequest, deleteRequest, addBlock, deleteBlock } from "../../actions/friends";
import { S3Image } from 'aws-amplify-react-native';
// import DeviceInfo from 'react-native-device-info';
import MutualFriends from './parts/mutual-friends'
import RecentlyPlayedGames from './parts/recently-played-games'
import CachedImage from "../cached-image";
import { StackActions } from 'react-navigation';
import CommonModal from "../common/modal";


class PublicProfile extends React.Component {
    state = {
        username: "",
        error: "",
        image: null,
        waiting: false,
        isEdit: false,
        switchValue: true,
        userId: "",
        timeZone: "",
      
        notificationSettings: null,
        friendReceived: "",
        friendSent: "",
        loaded: false,
        editBoopModal: false,
        modalVisible: false,

        mutualFriends: [],
        recentlyPlayedGames: [],

        isFriend: false,
        isBlocked: false,
    };


    componentDidMount() {

      const userID = this.props.navigation.getParam('id');
      
      this.props.friends.forEach((friend) => {
          if (friend.otherUser.id == userID) {
            this.setState({isFriend: true});
            return;
          }
      });

      this.props.blocks.forEach((block) => {
        if (block.blockee.id == userID) {
          this.setState({isBLocked: true});
          return;
        }
    });
      
      Query(UserQueries.getOtherUserProfile, {id: userID}).then(res => {
          this.setState({
              username: res.data.getUser.preferredUsername,
              userId: res.data.getUser.id,
              email: res.data.getUser.email,
          });
          if( this.state.friendReceived!==null)
            this.setState({friendSent: res.data.getUser.friendReceived.items.length > 0 && res.data.getUser.friendReceived.items[0].requestStatus, requestID: res.data.getUser.friendReceived.items.length > 0 ? res.data.getUser.friendReceived.items[0].id : null })
          if( this.state.friendSent!==null)
            this.setState({friendReceived: res.data.getUser.friendSent.items.length > 0 && res.data.getUser.friendSent.items[0].requestStatus, requestID: res.data.getUser.friendSent.items.length > 0 ? res.data.getUser.friendSent.items[0].id : null })

            this.setState({loaded: true})
          if(res.data.getUser.profilePicture!==null) {
            if (this.state.isFriend) {
              this.setState({ image: res.data.getUser.profilePicture });
            } else {
              Storage
              .get(res.data.getUser.profilePicture.fullsize.key, {level: 'public'})
              .then((uri) => {
                this.setState({ image: uri }); 
              });
            }
          }
      });
      
      Query(
        FriendQueries.listMutualFriends,
        {
          otherUserId: this.props.navigation.getParam('id')
        }).then(res => {
          this.setState({mutualFriends: res.data.listMutualFriends})
      });

      Query(
        UserQueries.gamesByUserUpdatedAt,
        {
          gameUserRelationUserId: this.props.navigation.getParam('id'),
          sortDirection: "DESC",
        }).then(res => {
          let games = []
          res.data.gamesByUserUpdatedAt.items.forEach(element => {
            games.push(element.game);
          });
          this.setState({recentlyPlayedGames: games})
      });
    }

    componentDidUpdate(prevProps){
         if(this.props.navigation.getParam('id')!=prevProps.navigation.getParam('id'))
         {
            this.setState({
              loaded: false,
              username: "",
              image: null,
              friendSent: "",
              mutualFriends: [],
              recentlyPlayedGames: [],
            })

        Query(UserQueries.getOtherUserProfile,{id:this.props.navigation.getParam('id')}).then(res => {
            this.setState({
                username: res.data.getUser.preferredUsername,
                userId: res.data.getUser.id,
                email: res.data.getUser.email
            });
            if( this.state.friendReceived!==null)
       
            this.setState({
              friendReceived: res.data.getUser.friendReceived.items.length>0  && res.data.getUser.friendReceived.items[0].requestStatus,
              requestID: res.data.getUser.friendReceived.items.length > 0 ? res.data.getUser.friendReceived.items[0].id : null
            })
            if( this.state.friendSent!==null)
            this.setState({
              friendSent: res.data.getUser.friendSent.items.length>0 && res.data.getUser.friendSent.items[0].requestStatus,
              requestID: res.data.getUser.friendSent.items.length > 0 ? res.data.getUser.friendSent.items[0].id : null
              
            })

            this.setState({loaded: true})
            if(res.data.getUser.profilePicture!==null)
            Storage.get(res.data.getUser.profilePicture.fullsize.key, {
                level: "public"
            }).then(res => this.setState({ image: res }));
            else
            this.setState({ image: null })
        });

        Query(
          FriendQueries.listMutualFriends,
          {
            otherUserId: this.props.navigation.getParam('id')
          }).then(res => {
            this.setState({mutualFriends: res.data.listMutualFriends})
        });
  
        Query(
          UserQueries.gamesByUserUpdatedAt,
          {
            gameUserRelationUserId: this.props.navigation.getParam('id'),
            sortDirection: "DESC",
          }).then(res => {
            let games = []
            res.data.gamesByUserUpdatedAt.items.forEach(element => {
              games.push(element.game);
            })
            this.setState({recentlyPlayedGames: games})
          });
    }
      }
    
      boopFriend() {
        this.props.navigation.navigate("New Boop", { preselectedFriendArray: [this.props.navigation.getParam('id')] });
      }

      addFriend(){
        Query(FriendsMutations.createFriendCustom, {friendReceiverId: this.props.navigation.getParam('id')}).
        then(res => this.props.addOutgoingRequest(res.data.createFriendCustom));
        this.setState({friendSent: "pending"});
      }

      goBack = () => {
        const popAction = StackActions.pop({n: 1});    
        this.props.navigation.dispatch(popAction);
      }

      gotoPublicProfile = (friend) => {
        const pushAction = StackActions.push({
          routeName: 'PublicProfile',
          params: {id: friend.id, name: friend.preferredUsername}
        });
        this.props.navigation.dispatch(pushAction);
      }

      blockMenu() {
        this.setState({editBoopModal: true, modalVisible: true});
      }

      blockFriend() {
        // this.state.modalVisible is set to the friend that it refers to.
        Query(FriendsMutations.createBlockCustom, {blockeeId: this.props.navigation.getParam('id')}).then(res => {
          this.props.addBlock(res.data.createBlockCustom);
          this.setState({modalVisible: false});
          Toast.show({
            text: `Successfully blocked the user`,
            buttonText: ''
          })
        });
      }

      cancelRequest(request){
        console.log(request);
        Query(Mutations.deleteFriendRequest, {input: {id: request}}).then((res) => console.log(res)).catch(err => console.log(err));
        Query(FriendQueries.listFriendRequestsSent, {requestStatusCreatedAt: {beginsWith: {requestStatus: `pending`}},friendSenderId:  this.props.user.user.id,
        sortDirection: "DESC"  });
        this.goBack();
      }

      unblockFriend() {
        
      }

    render() {
        let { image } = this.state;
        return (
            <Root>
            <Container>
                <Header
                    leftButton={
                        <HeaderButton
                            onPress={() => 
                                this.goBack()
                            }
                        >
                            <Icon style={{ color: COLORS.WHITE }} name="arrow-back" />
                        </HeaderButton>
                    }
                    rightButton={
                        <Button transparent onPress={() => this.blockMenu()}>
                          <Icon style={{color: COLORS.WHITE}} type="FontAwesome5" name="ellipsis-v" />
                        </Button>
                      }
                    title={"User Profile"}
                />
                <Content>
                    <StyledContent>
                        <EditImge>
                            <ImageButtonContainer>
                              {
                                (this.state.isFriend ) ?
                                 <CachedImage
                                  s3Image={image}
                                  preview={require("../../../assets/images/Avatar.png")}
                                  style={{ width: 100, height: 100, borderRadius: 50 }}
                                />
                                :
                                <Image
                                  source={
                                    image
                                    ? { uri: image }
                                    : require("../../../assets/images/Avatar.png")
                                  }
                                  style={{ width: 100, height: 100, borderRadius: 50 }}
                                /> 
                              }                   
                            </ImageButtonContainer>
                        </EditImge>
                        <UserNameText>
                        <Text style={{ alignSelf: "center", fontSize: 16, fontFamily: 'montserrat-semibold', color: "rgba(0, 0, 0, 0.6)"}}>{this.state.username}</Text>
                        {this.state.loaded &&
                         (this.state.isBlocked ?
                          <ActionButton bordered info onPress={() => {}} style={{borderColor: "#DF3C3E", backgroundColor: "white", width: 'auto'}} >
                            <Text style={{color: "#DF3C3E"}}>Unblock</Text>
                          </ActionButton>
                          :
                          this.state.isFriend ?
                          <ActionButton bordered
                            info onPress={() => this.boopFriend()} style={{width: 'auto'}}>
                            <Text>boop</Text>
                          </ActionButton>
                          : 
                          this.state.friendSent == "pending" ?
                           <ActionButton bordered info style={{borderColor: "#DF3C3E", backgroundColor: "white", width: 'auto'}} onPress={() => this.goBack()}>
                            <Text style={{color: "#DF3C3E"}}>Cancel Request</Text>
                          </ActionButton>
                          :
                          this.state.friendReceived == "pending" ?
                          <View style={{flexDirection: "row"}}>
                            <ActionButton info onPress={() => this.addFriend()} style={{backgroundColor: "#66E29F", borderColor: "#66E29F", width: 'auto'}}>
                              <Text style={{color: "white"}}>Accept</Text>
                            </ActionButton>
                            <ActionButton bordered info onPress={() => this.addFriend()} style={{borderColor: "rgba(0, 0, 0, 0.6)", marginLeft: wp("2.4%")}}>
                              <Text style={{color: "rgba(0, 0, 0, 0.6)"}}>Ignore</Text>
                            </ActionButton>
                          </View>
                          :
                          <ActionButton bordered info onPress={() => this.addFriend()} style={{width: 'auto'}}>
                            <Text>Add Friend</Text>
                          </ActionButton>)   
                        }
                        </UserNameText>

                        {/* <SectionTitle>Linked Accounts</SectionTitle>
                        <UserSections linking name={"HauDaHell"} />
                        <UserSections linking name={"HauDaHell"} />


                        <SectionTitle>Mutual Friends</SectionTitle>
                        <SingleUserCard>
                            <UserImage source={require("../../../assets/images/Avatar.png")} />
                            <Username >
                                Holla Dota
                             </Username>
                        </SingleUserCard>
                        <SectionTitle>Recently Played Games</SectionTitle>
                        <Middle horizontal={true} showsHorizontalScrollIndicator={false}>
                            {
                                this.props.games.map((game) => this.renderGame(game))
                            }
                        </Middle> */}
                    <MutualFriends friends={this.state.mutualFriends} gotoPublicProfile={this.gotoPublicProfile}/>
                    <RecentlyPlayedGames games={this.state.recentlyPlayedGames}/>
                    </StyledContent>
                </Content>
                
          <CommonModal
            show={this.state.modalVisible}
            close={() => this.setState({ modalVisible: false, confirmModal: false })}
            buttons={
              this.state.isBlocked ?
              [
                {iconName: "ban", text: "Unblock", iconColor: COLORS.RED, function: () => this.unblockFriend()},
              ]
              :
              [
                {iconName: "ban", text: "Block", iconColor: COLORS.RED, function: () => this.blockFriend()},
              ]
            }/>
            </Container>
            </Root>
        );
    }

    renderGame(game) {
        return (
            <GameContainer key={game.slug} info bordered >
                <GameContent>
                    {!!game.image ? <S3Image style={{ width: wp('7%'), height: wp('7%') }} imgKey={game.image.thumbSmall.key} imgKey={game.image.thumbSmall.key.replace('public/', '')} />
                        : <GameImage source={require('../../../assets/images/Anything.png')} />}
                    <GameName>{game.title}</GameName>
                </GameContent>
            </GameContainer>
        );
    }

    onError(err) {
        let message = err.message || err;
        if (message.startsWith("Invalid phone number")) {
            // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
            message =
                "Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.";
        }
        this.setState({ error: message, waiting: false });
    }
}

const mapStateToProps = state => {
  return {
    blocks: state.friends.blocks,
    friends: state.friends.friends,
    games: state.user.games,
    user: state.user
  };
};


const mapDispatchToProps = ({
  addOutgoingRequest,
  deleteRequest,
  addBlock,
  deleteBlock,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublicProfile);



const StyledContent = styled(Content) ``;
const ImageButtonContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const EditImge = styled.View`
  flex-direction: row;
  align-self: center;
`;

const HeaderButton = styled.TouchableOpacity`
  margin-right: 10px;
`;
const SectionTitle = styled.Text`
  color: ${COLORS.BLACK};
  padding: 10px;
  font-weight: bold;
  background-color: ${COLORS.LIGHTER_GREY};
  font-size: ${wp("4.5%")};
`;
const Username = styled.Text`
  flex: 1;
  font-size: ${wp("3.3%")};
  margin-left: ${wp("2.4%")};
`;
const UserNameText = styled.View`
  margin-bottom: 10px;
  justify-content: center;
  flex-direction: column;
  align-self: center;
`;
const ActionButton = styled(Button) `
  padding-right: 10px;
  padding-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 100px;
  height: 32px;
  min-width: 106px;
  justify-content: center;
  align-self: center;
`;
const GameContent = styled.View`
  align-items: center;
  justify-content: space-around;
  flex: 1;
`;
const GameContainer = styled(Button) `
  width: ${wp('19%')};
  height: ${wp('19%')};
  border-radius: 10px;
  margin-right: 10px;
  align-items: stretch;
`;
const GameImage = styled.Image`
  width: ${wp('7%')};
  height: ${wp('7%')};
`;
const GameName = styled.Text`
  font-size: 10px;
  text-align: center;
`;

const Middle = styled.ScrollView`
  margin: 10px;
  
`;
const UserImage = styled.Image`
  width: ${wp("13%")};
  height: ${wp("13%")};
`;
const SingleUserCard = styled.TouchableOpacity`
  border-bottom-width: 1px;
  padding: 11px;
  border-bottom-color: ${COLORS.LIGHTER_GREY};
  flex-direction: row;
  align-items: center;
`;
const CloseModalOverlay = styled(TouchableWithoutFeedback)`
`;
const InfoView = styled.TouchableOpacity`
  margin-bottom: 5px;
  margin-top: 5px;
  flex-direction: row;
`;
const ModalMenu = styled.View`
  background-color: white;
  padding: 10px;
  padding-bottom: 10px;
`;
const InfoTextBody = styled(Body)`
  align-items: flex-start;
  justify-content: flex-start;
  margin-left: 10px;
`;
const ModalContainer = styled.View`
  justify-content: flex-end;
  flex-direction: column;
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
`;
