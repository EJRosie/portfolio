import React from 'react';
import styled from 'styled-components';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../native-base-theme/variables/material';
import { H1 } from 'native-base';
import BoopCard from './parts/boop-card';
import { connect } from "react-redux";
import { StackActions } from 'react-navigation';

import {
  setPendingBoops,
  updateSpecificBoopPending,
} from "../../actions/boops";


class PendingBoops extends React.Component {

  render() {
    return (
      <PendingContainer>
        <Heading>PENDING ({this.props.boops.length})</Heading>
        {
          (this.props.boops || []).map((boop) => {
          return (
            <BoopCard user={this.props.user} nav={this.props.navigation} boop={boop} key={boop.boop.id} openDrawer={this.openDrawer.bind(this)} updateBoops={this.props.updateSpecificBoopPending}/>
          )})
        }
      </PendingContainer>
    );
  }

  openDrawer(boop) {
    const pushAction = StackActions.push({
      routeName: 'BoopDetails',
      params: {boop: boop, isFrom: "pending", refresh: () => this.props.refresh()}
    });
    this.props.navigation.dispatch(pushAction);
  }
}

const mapStateToProps = state => {
  const { pending, pendingNext} = state.boops;
  const { user } = state.user;
  
  return { user, boops: pending, next: pendingNext };
};

const mapDispatchToProps = dispatch => {
  return {
    updatePending: boops => {
      dispatch(setPendingBoops(boops));
    },
    updateSpecificBoopPending: (newBoop, reply) => {
      dispatch(updateSpecificBoopPending(newBoop, reply))
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingBoops);

const Heading = styled.Text `
  color: ${COLORS.TRUE_WHITE};
  font-size: 14px;
  font-weight: bold;
  font-family: montserrat-bold;
  margin-vertical: 20px;
`;
const PendingContainer = styled.View`
  background-color: ${COLORS.SECONDARY};
  color: ${COLORS.TRUE_WHITE};
  padding: 10px;
`;