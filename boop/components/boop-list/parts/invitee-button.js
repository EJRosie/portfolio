import React from 'react';
import styled from 'styled-components';
import { Button, Text, View, Toast } from 'native-base';
import { addOutgoingRequest } from '../../../actions/friends';
import { connect } from 'react-redux';
import * as Mutations from '../../../graphql-custom/boops/mutations';
import * as FriendMutations from '../../../graphql-custom/friends/mutations';
import Query from '../../../api';

class InviteeButton extends React.Component {

  state = {
    type: "",
    invite: null,
  }

  componentDidMount() {
    this.setState({type: this.props.type, invite: this.props.invite})
  }

  boopAgain(invite) {
    Query(Mutations.markReminderSent, {input: {boopInviteBoopId: invite.boopInviteBoopId, boopInviteInviteeId : invite.boopInviteInviteeId, reminderSent: true}});
    this.setState({type: "reminded"});
    Toast.show({
      text: `Reminder sent to ${invite.invitee.preferredUsername}`,
      buttonText: ''
    })
  }

  sendFriendRequest(invite) {
    Query(FriendMutations.createFriendCustom, { friendReceiverId: invite.invitee.id, friendSenderId }).then((res) => {
      this.props.addOutgoingRequest(res.data.createFriendCustom);
    });
    this.setState({type: "Request Sent"});
  }

  render() {
    if (this.state.type == "add")
      return <ActionButton rounded bordered info onPress={() => {this.sendFriendRequest(this.state.invite)}}><Text>Add Friend</Text></ActionButton>;
    else if (this.state.type == "Request Sent")
      return <ActionButton rounded bordered info ><Text>Request Sent</Text></ActionButton>;
    else if (this.state.type == "boop" && this.props.ownBoop)
      return <ActionButton rounded bordered info onPress={() => {this.boopAgain(this.state.invite)}}><Text>Remind</Text></ActionButton>;
    else if (this.state.type == "reminded" && this.props.ownBoop)
      return <ActionButton rounded info onPress={() => {}} style={{backgroundColor: "white"}}><Text style={{color: "#813AC2"}}>Reminded!</Text></ActionButton>;
    else
      return <View></View>;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = ({
  addOutgoingRequest,
});

export default connect(mapStateToProps, mapDispatchToProps)(InviteeButton);

const ActionButton = styled(Button)`
  width: 120px;
  height: 32px;
  justify-content: center;
`;
