import React, { Component } from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {COLORS} from '../../../../native-base-theme/variables/material';
import { Text, Button, Icon } from 'native-base';
import {Storage} from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import { TouchableOpacity } from "react-native";
import CachedImage from "../../cached-image";

export default class Friend extends React.Component {
  state = {
    image: null
  }

  componentDidMount() {
    if(!this.props.friend || !this.props.friend.profilePicture) {return;}
    this.setState({image: this.props.friend.profilePicture});
  }

  render() {
    return (
      <SingleUserCard>
        <TouchableOpacity onPress={()=> this.props.gotoPublicProfile(this.props.friend)}>
        <CachedImage
          s3Image={this.state.image}
          preview={require('../../../../assets/images/Avatar.png')}
          style={{width: 32, height: 32,  borderRadius: 32 / 2}}
        />
        </TouchableOpacity>
        
        <Username onPress={()=>this.props.gotoPublicProfile(this.props.friend)}>{this.props.friend.preferredUsername}</Username>
       
        <ActionButton bordered info onPress={() => this.props.onBoop(this.props.friend)}>
          <ButtonText>boop</ButtonText>
        </ActionButton>
        <Button transparent light 
          onPress={() => {
            this.props.openDotMenu(this.props.friend, this.props.friendRelation);
          }}
        >
          <Text><Icon style={{fontSize: 18, color: "rgba(0, 0, 0, 0.6)"}} type="FontAwesome" name="ellipsis-v" /></Text>
        </Button>
      </SingleUserCard>
    );
  }
}

const Username = styled.Text`
  flex: 1;
  font-family: montserrat;
  font-size: 14px;
  margin-left: ${wp('2.4%')};
  color: rgba(0, 0, 0, 0.6);
`;
const UserImage = styled(CachedImage)`
  width: ${wp('11.75%')};
  height: ${wp('11.75%')};
  border-radius: ${wp('11.75%') / 2};
`;
const ActionButton = styled(Button)`
  width: 106;
  height: 32;
  border-radius: 100;
  margin-left: ${wp('2.4%')};
  justify-content: center;
  align-self: center;
`;
const ButtonText = styled(Text)`
  margin: 0;
  font-family: montserrat-semibold;
  font-size: 12;
`;
const SingleUserCard = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;