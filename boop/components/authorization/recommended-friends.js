import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Keyboard } from 'react-native';
import {COLORS} from '../../../native-base-theme/variables/material';
import * as Queries from '../../graphql-custom/search/queries';
import Query from '../../api';
import { Container, Content, Body, Icon, Input, List, ListItem,Root, Text} from 'native-base';
import Item from '../friends/parts/searched-friend';
import Header from '../common/header';
import * as Mutations from '../../graphql-custom/friends/mutations';
import { requestFriend, deleteRequest, setFriends, addOutgoingRequest, addBlock, deleteBlock } from '../../actions/friends';
import { connect } from 'react-redux';
import {
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { StackActions } from 'react-navigation';
 

class RecommendedFriends extends React.Component {  
  state = {
    searchedFriends: [],
    hasTyped: false,
    inputText: "",
    modalVisible: false,
    userId: "",
  }

  openDotMenu = user => {
    this.setState({ userId: user.id })
    this.setState({ modalVisible: true });
  }

  onScrollBeginDrag = () => {
    Keyboard.dismiss();
  }

  render() {
    return (
      <Root>
      <Container>
        
          <Header 
          leftButton={
            <HeaderButton onPress={() => { this.navigateToFriends()}}>
              <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
            </HeaderButton>
          }
          title={"Recommended friends"}
          />
        
        <Content onScrollBeginDrag={this.onScrollBeginDrag}>
          <StyledList limitHeight={!!this.props.onBackButton}>
            <ListItem style={{height: 48, borderWidth: 1, borderColor: "rgba(0, 0, 0, 0.25)", borderRadius: 5, marginTop: 30, marginBottom: 10, marginRight: 20}}>
              <Icon
                style={{ color: "rgba(0, 0, 0, 0.25)", fontSize: 20, marginLeft: 10}}
                type="FontAwesome5"
                name="search"
                
              />
              <StyledInput
                onFocus={(e) => {e.preventDefault(); e.stopPropagation();}}
                onChangeText={(text) => this.onTextChange(text)} 
                value={this.state.inputText}
                ref={(ref) => { this.game_input = ref; }} 
                autoFocus={true}
                returnKeyType={"search"}
                placeholder={"Search by name"}
                placeholderTextColor={"rgba(0, 0, 0, 0.6)"}
              />
              {
                this.state.inputText != "" &&
                <Icon
                  style={{ color: "#813AC2", fontSize: 20 }}
                  type="FontAwesome5"
                  name="times"
                  onPress={()=>this.setState({inputText:""})}
                />
              }
            </ListItem>
            <ListItem style={{borderBottomWidth: 0}}>
              {
                this.state.hasTyped && this.state.searchedFriends.length <= 0 ?
                <SearchLabelText>No Search Results</SearchLabelText>
                : this.state.hasTyped && this.state.searchedFriends.length > 0 ?
                <SearchLabelText>Search Results</SearchLabelText>
                :
                <SearchLabelText>Suggested Friends</SearchLabelText>
              }
            </ListItem>
            {
              (this.state.hasTyped ? this.state.searchedFriends : this.props.recommendedFriends || []).map((user) => {
                if(user.id === this.props.navigation.getParam('userId')) {return;}
                return (
                <ListItem key={user.id + " item"} noIndent style={{borderBottomWidth: 0}}>
                  <Item 
                    key={user.id} 
                    user={user}
                    openDotMenu={this.openDotMenu} 
                    gotoPublicProfile={this.gotoPublicProfile}
                    addFriend={ this.addFriend} 
                  />
                </ListItem>
              )})
            }
          </StyledList>
        </Content>
        <Modal
          // animationType="slide"
          transparent={true}
          visible={!!this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}
        >
          <CloseModalOverlay onPressOut={() => this.setState({modalVisible: false, confirmModal: false})}>
          
          <ModalContainer>
            <ModalMenu>
              <InfoView onPress={() => this.blockFriend()}>
                <Icon style={{color: COLORS.RED}} type="FontAwesome5" name="ban" /> 
                <InfoTextBody>
                  <Text style={{color: COLORS.RED}}>Block</Text>
                </InfoTextBody>
              </InfoView>
            </ModalMenu>
            </ModalContainer>
            </CloseModalOverlay>
         
          
          </Modal>
      </Container>
      </Root>
    );
  }

  addFriend = (friend) => {
    Query(Mutations.createFriendCustom, {friendReceiverId: friend.id}).then((res) => {
      this.props.dispatchAddOutgoingRequest(res.data.createFriendCustom);
    });
  }

  navigateToFriends = () => {
    this.props.navigation.navigate("Friends");
  }

  gotoPublicProfile = (friend) => {
    const pushAction = StackActions.push({
      routeName: 'PublicProfile',
      params: {id: friend.id, userID: this.props.user.id, name: friend.preferredUsername, from: "AddFriends", state: this.state}
    });
    this.props.navigation.dispatch(pushAction);
  }

  onTextChange = (text) => {
    this.setState({inputText: text, hasTyped: true});
    Query(Queries.searchUsers, {filter: {preferredUsername: {regexp: `.*${text.toLowerCase()}.*`}}, limit: 10})
    .then((res) => {
      this.setState({ searchedFriends: res.data.searchUsers.items });
    });
  }
}

const mapStateToProps = (state) => {
  return { 
    user: state.user.user,
  };
};
  
const mapDispatchToProps = dispatch => {
  return {
    dispatchDeleteRequest: (request) => {
      dispatch(deleteRequest(request))
    },
    dispatchSetFriends: (friends) => {
      dispatch(setFriends(friends))
    },
    dispatchRequestFriend: (friend) => {
      dispatch(requestFriend(friend))
    },
    dispatchAddOutgoingRequest: (request) => {
      dispatch(addOutgoingRequest(request))
    },
    addBlock: (block) => {
      dispatch(addBlock(block));
    },
    deleteBlock: (block) => {
      dispatch(deleteBlock(block));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendedFriends);

const StyledList = styled(List)`
  ${props => props.limitHeight && `max-height: ${hp('80%')};'`}
`;
const HeaderButton = styled.TouchableOpacity`
margin-right: 10px;
`;
const StyledInput= styled(Input)`
  font-family: montserrat;
  font-size: 16;
  color: rgba(0, 0, 0, 0.6);
  margin-left: 10px;
  border-bottom-width: 0;
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
  background-color: rgba(0,0,0,0.5);
`;

const SearchLabelText = styled.Text`
  font-family: montserrat;
  font-size: 12;
  color: rgba(0, 0, 0, 0.6);
`;