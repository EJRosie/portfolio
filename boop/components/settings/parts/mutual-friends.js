import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { COLORS } from "../../../../native-base-theme/variables/material";
import { List, ListItem, View, Left, Right, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import { S3Image } from 'aws-amplify-react-native';
import CachedImage from "../../cached-image";

export default class MutualFriends extends React.Component {

  render() {
    const friends = this.props.friends;

    return (
      <List>
        <ListItem style={{borderBottomWidth: 0}}>
          <Text style={{color: "#813AC2", fontFamily: 'montserrat-semibold', fontSize: 16}}>Mutual Friends</Text>
        </ListItem>
        { friends.length > 0 ?
          this.props.friends.map((item, i) => (
            <FriendListItem>
              <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => this.props.gotoPublicProfile(item)}>
                <FriendProfilePicture
                  s3Image={item.profilePicture}
                  preview={require('../../../../assets/images/Avatar.png')}/>
                <FriendUsername>{item.preferredUsername}</FriendUsername>
              </TouchableOpacity>  
            </FriendListItem>
          ))
          :
          <Text style={{color: "rgba(0, 0, 0, 0.6)", fontFamily: 'montserrat', fontSize: 16, textAlign: "center"}}>You have no mutual friends.</Text>
        }
      </List>
    );
  }
}

const FriendProfilePicture = styled(CachedImage)`
  width: ${wp('11.75%')};
  height: ${wp('11.75%')};
  border-radius: ${wp('11.75%') / 2};
`;

const FriendUsername = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${COLORS.DARK_GREY};
  margin-left: ${wp('2.4%')};
  align-items: center;
  align-self: center;
  height: 20px;
`;

const FriendListItem = styled(ListItem)`
  align-content: center;
  align-items: center;
  flex-direction: row;
  border-bottom-width: 0;
`;
