import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "../../../../native-base-theme/variables/material";
import { Button, Icon, List, ListItem, Right, Text, View } from "native-base";
import { S3Image } from 'aws-amplify-react-native';
import { ScrollView, TouchableOpacity } from 'react-native';
import Query from '../../../api';
import * as AllMutations from '../../../graphql/mutations';
import CachedImage from "../../cached-image";

export default class SuggestedFriends extends React.Component {

  state = {
    suggestedFriends: []
  }

  componentDidMount = () => {
    const suggestedFriends = this.props.suggestedFriends;
    this.setState({suggestedFriends: suggestedFriends})
  }

  acceptSuggestedFriend = (index) => {
    let suggestedFriends = this.state.suggestedFriends;
    this.props.addFriend(suggestedFriends[index].otherUser);
    suggestedFriends.splice(index, 1);
    this.setState({suggestedFriends: suggestedFriends})
  }

  ignoreSuggestedFriend = (index) => {
    let suggestedFriends = this.state.suggestedFriends;
  
    Query(AllMutations.updateSuggestedFriend, {
      input: {
        id: suggestedFriends[index].id,
        ignoreType: "temporary"
      }
    })
    suggestedFriends.splice(index, 1);
    this.setState({suggestedFriends: suggestedFriends})
  }
  
  render() {
    if (this.state.suggestedFriends.length > 0)
      return (
        <Container>
          <ListItem itemDivider>
            <Text>Suggested Friends</Text>
          </ListItem>
          <ScrollView horizontal={true}>
            {
              this.state.suggestedFriends.map((item, i) => (
                <SuggestedFriendItem>
                  <IconTouchableOpacity onPress={() => this.ignoreSuggestedFriend(i)}>
                    <Icon style={{color: COLORS.LIGHTER_GREY, fontSize: wp('3%')}} type="FontAwesome5" name="times" />
                  </IconTouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.gotoPublicProfile(item.otherUser)}>
                    {
                      !!item.otherUser.profilePicture ? <S3Image style={{width: wp('15%'), height: wp('15%'), resizeMode: 'contain'}} 
                      imgKey={item.otherUser.profilePicture.thumbLarge.key} imgKey={item.otherUser.profilePicture.thumbLarge.key.replace('public/', '')}/>
                      : <SuggestedFriendImage source={require('../../../../assets/images/Avatar.png')}/>
                    }
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => this.props.gotoPublicProfile(item.otherUser)}>
                    <SuggestedFriendUsername>{item.otherUser.preferredUsername}</SuggestedFriendUsername>              
                  </TouchableOpacity>

                  <SuggestedFriendMutualFriends>1 mutual friend</SuggestedFriendMutualFriends>
                  
                  <ActionButtonContainer>
                  <ActionButton info onPress={() => this.acceptSuggestedFriend(i)}>
                    <ActionButtonText>+ Add Friend</ActionButtonText>
                  </ActionButton>
                  </ActionButtonContainer>
                  
                </SuggestedFriendItem>
              ))
            }
          </ScrollView>
        </Container>
      );
    else
        return null;
  }
}

const Container = styled.View`
  width: ${wp('100%')};
`;

const SuggestedFriendImage = styled(CachedImage)`
  width: ${wp('11.75%')};
  height: ${wp('11.75%')};
`;

const SuggestedFriendUsername = styled.Text`
  font-family: montserrat;
  font-size: ${wp('3%')};
  text-align: center;
  color: #518CFF;
  margin-vertical: ${wp('1%')};
`;

const SuggestedFriendMutualFriends = styled.Text`
  font-family: montserrat;
  font-size: ${wp('2.5%')};
  text-align: center;
  color: ${COLORS.LIGHT_GREY};
`;

const SuggestedFriendItem = styled(ListItem)`
  width: ${wp('28%')};
  height: ${wp('35%')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-horizontal: 0;
  padding: 0;
  margin-vertical: 8px;
  border-radius: 5px;
  shadow-color: #000;
  shadow-offset: { width: 0, height: 1 };
  shadow-opacity: 0.19;
  shadow-radius: 1;  
  elevation: 1;
`;

const ActionButtonContainer = styled.View`
  margin-top: ${wp('1%')};
`;

const ActionButton = styled(Button)`
  border-radius: 5px;
  width: ${wp('24%')};
  height: ${wp('6%')};
  justify-content: center;
`;

const ActionButtonText = styled.Text`
  font-family: montserrat;
  font-size: ${wp('2.5%')};
  text-align: center;
  color: white;
`;

const IconTouchableOpacity = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justifyContent: flex-end;
  width: 100%;
  margin-right: ${wp('4%')};
`;
