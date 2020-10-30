import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native';
import {COLORS} from '../../../native-base-theme/variables/material';
import * as Queries from '../../graphql-custom/search/queries';
import * as FriendMutations from '../../graphql-custom/friends/mutations';
import Query from '../../api';
import { Container, Content, Body, Button, Icon, Input, List, ListItem,Root, Text, Toast} from 'native-base';
import Item from './parts/searched-friend';
import Header from '../common/header';
import {
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { addBlock, deleteBlock } from '../../actions/friends';


class AddGames extends React.Component {
  state = {
    results: [],
    inputText:"",
    editBoopModal: false,
        modalVisible: false,
        userId: "",
  }

  componentDidMount(){
    this.game_input._root.focus();
  }

  openDotMenu =(user)=>{
    this.setState({userId:user.id})
    this.setState({editBoopModal: true, modalVisible: true});
  }

  blockFriend() {
    // this.state.modalVisible is set to the friend that it refers to.
    Query(FriendMutations.createBlockCustom, {blockeeId: this.state.userId}).then(res => {
      this.props.addBlock(res.data.createBlockCustom);
      this.setState({modalVisible: false});
      Toast.show({
        text: `Successfully blocked the user`,
        buttonText: ''
      })
    });
  }

  render() {
    return (
      <Root>
      <Container>
        {!!this.props.onBackButton &&
          <Header 
          leftButton={
            <HeaderButton onPress={() => {this.props.onBackButton()}}>
              <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
            </HeaderButton>
          }
          title={"Search users"}
          />
        }
        <Content>
          <StyledList limitHeight={!!this.props.onBackButton}>
            <ListItem noIndent>
            <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="search"
                
              />
              <StyledInput onFocus={(e) => {e.preventDefault(); e.stopPropagation();}} 
              onChangeText={(text) => this.onTextChange(text)} 
              value={this.state.inputText}
              ref={(ref) => { this.game_input = ref; }} 
              autoFocus={true}
              returnKeyType={"search"}
              placeholder={"Search by username"}/>
              {this.state.inputText!="" &&
              <Icon
                style={{ color: COLORS.LIGHT_GREY }}
                type="FontAwesome5"
                name="times-circle"
                onPress={()=>this.setState({inputText:""})}
              />
      }
            </ListItem>
              {
                this.state.results.map((user) => {
                  if(user.id === this.props.user.id) {return;}
                  return (
                  <ListItem key={user.id + " item"} noIndent>
                    <Item 
                      key={user.id} 
                      user={user}
                      openDotMenu={this.openDotMenu} 
                      gotoPublicProfile={this.props.gotoPublicProfile}
                      addFriend={(friend) => this.props.addFriend(friend)} 
                      boopFriend={(friend) => this.props.boopFriend(friend)}
                      acceptRequest={this.props.acceptRequest.bind(this)}
                      rejectRequest={this.props.rejectRequest.bind(this)}
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
              
              {/* <InfoView onPress={() => this.setState({confirmModal: true,isremoveModal: true})}>
                <Icon style={{color: COLORS.RED}} type="FontAwesome5" name="user-times" /> 
                <InfoTextBody>
                  <Text style={{color: COLORS.RED}}>Remove Friend</Text>
                </InfoTextBody>
              </InfoView> */}

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

  onTextChange = (text) => {
    this.setState({inputText: text})
    Query(Queries.searchUsers, {filter: {preferredUsername: {regexp: `.*${text.toLowerCase()}.*`}}, limit: 10})
    .then((res) => {
      this.setState({results: res.data.searchUsers.items});
    });
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    
  };
};

const mapDispatchToProps = ({
  addBlock,
  deleteBlock,
});

export default connect(mapStateToProps, mapDispatchToProps)(AddGames);

const StyledList = styled(List)`
  ${props => props.limitHeight && `max-height: ${hp('80%')};'`}
`;
const HeaderButton = styled.TouchableOpacity`
margin-right: 10px;
`;
const StyledInput= styled(Input)`
margin-left: 10px;`
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