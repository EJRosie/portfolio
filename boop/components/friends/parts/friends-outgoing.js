import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../../../../native-base-theme/variables/material';
import { Button, Text, Icon} from 'native-base';
import {View, Image, TouchableOpacity} from 'react-native';
import {Storage} from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
export default class FriendOutgoing extends React.Component {
  state = {
    image: null
  }
  componentDidMount() {
    if(!!this.props.user.profilePicture) {
      Storage.get(this.props.user.receiver.profilePicture.fullsize.key, {level: 'public'}).then(res => this.setState({image: res}));
    }
  }
  render() {
    const {user} = this.props;
    return (
      <SingleUserCard onPress={()=> this.props.gotoPublicProfile(user.receiver)}>
        {/* <UserImage source={!!this.state.image ? {uri: this.state.image} : require('../../../../assets/images/Avatar.png')}/> */}
        {!!user.receiver.profilePicture && user.receiver.profilePicture.thumbLarge!=null ? <S3Image style={{width: wp('11.75%'), height: wp('11.75%'), borderRadius: wp('11.75%') / 2}} 
                  imgKey={user.receiver.profilePicture.fullsize.key} imgKey={user.receiver.profilePicture.thumbLarge.key.replace('public/', '')}/>
                   : <UserImage source={require('../../../../assets/images/Avatar.png')}/>}
        <Username>{user.receiver.preferredUsername}</Username>
          <ActionButton bordered info onPress={() => this.props.cancelRequest(user)}><ButtonText>Cancel</ButtonText></ActionButton>
      </SingleUserCard>
    );
  }
}
const ButtonText = styled(Text)`
  margin: 0;
  font-family: montserrat;
  font-size: 12;
  color: #DF3C3E;
`;
const ButtonIcon = styled(Icon)`
  font-size: ${wp('3.3%')};
  margin: 0;
  margin-left: ${wp('1.5%')};
`;
const UserImage = styled.Image`
  width: ${wp('11.75%')};
  height: ${wp('11.75%')};
  border-radius: 20px;
`;
const ActionButton = styled(Button)`
  border-radius: 100;
  margin-left: ${wp('2.4%')};
  width: 80;
  height: 32;
  border-color: #DF3C3E;
  justify-content: center;
`;
const Username = styled.Text`
  flex: 1;
  font-size: ${wp('3.3%')};
  margin-left: ${wp('2.4%')};
`;
const SingleUserCard = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;