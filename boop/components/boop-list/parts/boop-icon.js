import React, { Component } from 'react';
import {COLORS} from '../../../../native-base-theme/variables/material';
import styled from 'styled-components';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {Storage} from 'aws-amplify';

import StatusIcon from './status-icon';
import CachedImage from '../../cached-image';
import { View } from 'native-base';
import { connect } from "react-redux";

class BoopIcon extends React.Component {
  state = {
    image: null
  }

  componentDidMount() {
    if(this.props.user && this.props.user.profilePicture){
      this.setState({image: this.props.user.profilePicture});
    }
    else if(this.props.self){
      this.setState({image: this.props.userProfilePicture});
    }
  }

  render() {
    return (
      <IconView self={this.props.self}>  
        <IconImage
          s3Image={this.state.image}
          preview={require('../../../../assets/images/Avatar.png')}/>
        {this.getStatus(this.props.status)}
      </IconView>
    );
  }

  getStatus(status) {
    if(this.props.host) {
      return <StatusIcon color={COLORS.GOLD} icon={"crown"}/>
    }
    switch(status) {
      case "yes":
        return <StatusIcon color={COLORS.GREEN} icon={"check-circle"}/>
      case "later":
        return <StatusIcon color={COLORS.YELLOW} icon={"clock"}/>
      case "no":
        return <StatusIcon color={COLORS.RED} icon={"times-circle"}/>
      case "host":
        return <StatusIcon color={COLORS.GOLD} icon={"crown"}/>
      case null:
        return <StatusIcon color={"#8E8E8E"} icon={"question-circle"}/>
    }
  }
}

const mapStateToProps = (state) => {
  return { userProfilePicture: state.user.profilePicture };
};

export default connect(
  mapStateToProps,
)(BoopIcon);

const IconView = styled(View)`
  margin-right: 12px;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  ${props => props.self ? 
    `border-radius: 50px;
    background-color: ${COLORS.BLUE};`
    : ""
  }
`;
const IconImage = styled(CachedImage)`
  width: 32px;
  height: 32px;
  border-radius: 15px;
`;