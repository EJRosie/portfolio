import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../native-base-theme/variables/material';
import { Container, Button, Icon, H1 } from 'native-base';
import BoopCard from './parts/archived-boop-card';
import Header from "../common/header";
import { connect } from "react-redux";
import {
  setPendingBoops,
  setScheduledBoops,
  addMoreScheduled,
  updateSpecificBoopActive,
  updateSpecificBoopPending,
  setArchivedBoops
} from "../../actions/boops";

class BoopArchive extends React.Component {
  render() {
    const BoopsAsArray = Object.keys(this.props.boops).map(day => {return {data: this.props.boops[day], title: day}});
    return (
      <Container>
          <Header
            leftButton={
              <Button transparent onPress={() => {this.navigateToYourBoops()}}>
                <Icon style={{ color: COLORS.WHITE }} name='arrow-back' />
              </Button>
            }
            title={"Archived Boops"}
          />
      <BoopList
        extraData={this.props.refreshed}
        data={Object.keys(this.props.boops)}
        renderItem={({item, index, section}) => this.renderBoop(item)}
        renderSectionHeader={({section: {title}}) => this.renderHeading(title)}
        sections={BoopsAsArray}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps='always'
      />
      </Container>
    );
  }

  navigateToYourBoops = () => {
    this.props.navigation.navigate("Your Boops");
  }

  renderBoop(boop) {
    return (
      <BoopCard
        user={this.props.user} 
        boop={boop} 
        key={boop.id} 
        openDrawer={()=>{}} 
        updateBoops={()=>{}}
        archive={true}
        nav={this.props.navigation}
      />
    );
  }

  renderHeading(day) {
    return (
      <Heading>
        {moment(day, "YYYYMMDD").calendar(null,{
          lastDay : '[Yesterday]',
          sameDay : '[Today]',
          nextDay : '[Tomorrow]',
          lastWeek : 'dddd, Do MMMM',
          nextWeek : 'dddd, Do MMMM',
          sameElse : 'dddd, Do MMMM'
        })}
      </Heading>
    );
  }
}

const mapStateToProps = state => {
  const { archived, archivedNext } = state.boops;
  const { user } = state.user;
  
  return { boops: archived, next: archivedNext, user};
};
const mapDispatchToProps = dispatch => {
  return {
    updatePending: boops => {
      dispatch(setPendingBoops(boops));
    },
    updateScheduled: boops => {
      dispatch(setScheduledBoops(boops));
    },
    updateArchived: boops => {
      dispatch(setArchivedBoops(boops));
    },
    updateSpecificBoopActive: (newBoop) => {
      dispatch(updateSpecificBoopActive(newBoop))
    },
    updateSpecificBoopPending: (newBoop) => {
      dispatch(updateSpecificBoopPending(newBoop))
    },
    addScheduled: boops => {
      dispatch(addMoreScheduled(boops));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BoopArchive);


const Heading = styled(H1) `
  color: ${COLORS.BLACK};
  font-size: ${wp('3.3%')};
  background-color: white;
  margin-top: -10px;
  padding-top: 10px;
`;
const HeadingNoBoop = styled(H1) `
  color: ${COLORS.BLACK};
  text-align: center;
  font-size: ${wp('3.3%')};
`;
const BoopList = styled.SectionList`
  color: ${COLORS.BLACK};
  padding: 10px;
`;