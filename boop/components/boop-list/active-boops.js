import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../native-base-theme/variables/material';
import { H1 } from 'native-base';
import BoopCard from './parts/boop-card';
import { StackActions } from 'react-navigation';

import {
  setScheduledBoops,
  addMoreScheduled,
  updateSpecificBoopActive
} from "../../actions/boops";


class ScheduledBoops extends React.Component {

  shouldComponentUpdate(nextProps){
    return(nextProps.changed !== this.props.changed);
  }

  render() {
    const BoopsAsArray = Object.keys(this.props.boops).map(day => {return {data: this.props.boops[day], title: day}});
    return (
      <BoopList
        extraData={this.props.changed}
        data={Object.keys(this.props.boops)}
        renderItem={({item, index, section}) => this.renderBoop(item)}
        keyExtractor={(item, index) => item.boop.id}
        renderSectionHeader={({section: {title}}) => this.renderHeading(title)}
        sections={BoopsAsArray}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      />
    );
  }


  renderBoop(boop) {
    return (
      <BoopCard user={this.props.user} boop={boop} nav={this.props.navigation} key={boop.id} openDrawer={this.openDrawer.bind(this)} updateBoops={this.props.updateSpecificBoopActive}/>
    );
  }

  renderHeading(day) {
    return (
      <Heading>
        {moment(day, "YYYYMMDD").calendar(null,RELATIVE_CALENDAR)} ({this.props.boops[day].length})
      </Heading>
    );
  }

  openDrawer(boop) {
    const pushAction = StackActions.push({
      routeName: 'BoopDetails',
      params: {boop: boop, isFrom: "active", refresh: () => this.props.refresh()}
    });
    this.props.navigation.dispatch(pushAction);
  }
}

const mapStateToProps = state => {
  const { scheduled, scheduledNext, scheduledTotal, scheduledChanged} = state.boops;
  const { user } = state.user;

  return { user, boops: scheduled, next: scheduledNext, total: scheduledTotal, changed: scheduledChanged };
};

const mapDispatchToProps = dispatch => {
  return {
    updateScheduled: boops => {
      dispatch(setScheduledBoops(boops));
    },
    updateSpecificBoopActive: (newBoop) => {
      dispatch(updateSpecificBoopActive(newBoop))
    },
    addScheduled: boops => {
      dispatch(addMoreScheduled(boops));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScheduledBoops);

const Heading = styled.Text`
  color: ${COLORS.DARK_GREY};
  font-size: 14px;
  font-weight: bold;
  font-family: montserrat-bold;
  margin-vertical: 20px;
  text-transform: uppercase;
`;
const BoopList = styled.SectionList`
  color: ${COLORS.BLACK};
  padding: 10px;
`;

const RELATIVE_CALENDAR = {
  lastDay : '[Yesterday]',
  sameDay : '[Today]',
  nextDay : '[Tomorrow]',
  lastWeek : 'dddd, Do - MMM',
  nextWeek : 'dddd, Do - MMM',
  sameElse : 'dddd, Do - MMM'
};