import React from "react";
import styled from "styled-components";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { connect } from "react-redux";
import { COLORS } from "../../../native-base-theme/variables/material";
import { RefreshControl, ActivityIndicator, KeyboardAvoidingView, Keyboard, Image} from "react-native";
import moment from 'moment';
import Query from '../../api';
import * as Queries from '../../graphql-custom/boops/queries';

import {
  setPendingBoops,
  setScheduledBoops,
  addMoreScheduled,
  updateSpecificBoopActive,
  updateSpecificBoopPending,
  setArchivedBoops
} from "../../actions/boops";


import {
  Container,
  Content,
  Button,
  Text,
  Spinner,
  View,
  H1
} from "native-base";
import Icon from "../common/icon";
import Header from "../common/header";
import PendingBoops from "./pending-boops";
import ActiveBoops from "./active-boops";
import CachedImage from "../cached-image";
import { StackActions } from 'react-navigation';

class BoopList extends React.Component {
  state = {
    boop: null,
    refreshing: false,
    loadingMore: false,
    isBoopClicked: false,
    showProgress: false,
    isFrom: "",
    refreshed: false,
    isLoading: true,
  };

  closeDrawer() {
    this._drawer._root.close();
  }

  openDrawer(boop) {
    const pushAction = StackActions.push({
      routeName: 'BoopDetails',
      params: {boop: boop, isFrom: "pending", refresh: () => this.onRefresh()}
    });
    this.props.navigation.dispatch(pushAction);
  }

  openDrawerActive(boop) {
    const pushAction = StackActions.push({
      routeName: 'BoopDetails',
      params: {boop: boop, isFrom: "active", refresh: () => this.onRefresh()}
    });
    this.props.navigation.dispatch(pushAction);
  }

  openProfile() {
    const pushAction = StackActions.push({
      routeName: 'Profile',
      params: {from: "your boops"}
    });
    this.props.navigation.dispatch(pushAction);
  }

  componentDidMount() {
    if (!!this.props.scheduledChanged) this.setState({ showProgress: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scheduledChanged != this.props.scheduledChanged) {
      if (!!!prevProps.scheduledChanged && !!this.props.scheduledChanged) {
        this.setState({ showProgress: true });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({refreshed: !this.state.refreshed});
  }

  gotoPublicProfile = (friend) => {
    const pushAction = StackActions.push({
      routeName: 'PublicProfile',
      params: {id: friend.id, from: "Your Boops", name: friend.preferredUsername}
    });
    this.props.navigation.dispatch(pushAction);
  }

  boopAgain = (user) => {
    const pushAction = StackActions.push({
      routeName: "New Boop",
      params: {preselectedFriendArray: [user.id]}
    });
    this.props.navigation.dispatch(pushAction);
  }

  navigateToArchived = () => {
    const pushAction = StackActions.push({
      routeName: "Archive",
    });
    this.props.navigation.dispatch(pushAction);
  }

  navigateToNewBoop = () => {
    this.props.navigation.navigate("New Boop");
  }

  render() {
    const totalBoops = this.props.pending.length + Object.keys(this.props.scheduled).length;
    if (totalBoops === 0) {
      return (
        <Container>
          <Header
            scrollFunc={() => this.scroll.scrollTo({x: 0, y: 0, animated: true})}
            leftButton={
              <Button transparent onPress={() => this.openProfile()}>
                <IconView self={this.props.self}>
                <IconImage
                  s3Image={this.props.user.profilePicture}
                  preview={require("../../../assets/images/Avatar.png")} />
                </IconView>
              </Button>
            }
            rightButton={ Object.keys(this.props.archived).length &&
              <Button transparent onPress={() => this.navigateToArchived()}>
                <Image source={"../../../assets/images/archive.png"}/>
              </Button>
            }
          />
          {!this.state.showProgress &&
            <ProgresView>
            <ActivityIndicator size="large" color="#0000ff" />
            </ProgresView>
            }
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            removeClippedSubviews={false}
            disableKBDismissScroll={true}
            resetScrollToCoords={null}
            innerRef={ref => {this.scroll = ref}} 
          >
          {this.state.showProgress &&
            <NoneContent>
              <MyBoopsTitle>My Boops</MyBoopsTitle>
              <NoneText>You currently have no pending or scheduled Boops</NoneText>
              <TryText>
                Try Booping a friend!
              </TryText>
              <FirstBoopButton
                primary
                bordered
                rounded
                block
                large
                onPress={() => this.navigateToNewBoop()}
              >
                <Text>Send Boop</Text>
              </FirstBoopButton>
            </NoneContent>
          }
            
          </Content>
        </Container>
      );
    }
    return (
        <Container>
          <Header
            scrollRef={this.scroll}
            leftButton={
              <Button transparent onPress={() => this.openProfile()}>
                <IconView self={this.props.self}>
                  <IconImage
                    s3Image={this.props.user.profilePicture}
                    preview={require("../../../assets/images/Avatar.png")} />
                </IconView>
              </Button>
            }
            rightButton={ Object.keys(this.props.archived).length ?
              <Button transparent onPress={() => this.navigateToArchived()}>
                <Icon style={{ color: COLORS.WHITE }} type="FontAwesome5" name="folder" />
              </Button>
              : null
            }
          />
          <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled>
          <Content
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            removeClippedSubviews={true}
            scrollEventThrottle={300}
            onScrollBeginDrag={this.setCurrentReadOffset}
            innerRef={ref => {this.scroll = ref}}
          >
           
          {this.props.pending.length>0 &&
            <PendingBoops
              refresh={this.onRefresh.bind(this)}
              refreshed={this.state.refreshed}
              navigation={this.props.navigation}
            />
          }
            <ActiveBoops
              refresh={this.onRefresh.bind(this)}
              refreshed={this.state.refreshed}
              navigation={this.props.navigation}
            />
            {this.state.loadingMore && <Spinner color={COLORS.BLUE} />}
          </Content>
          </KeyboardAvoidingView>
        </Container>
    );
  }

  setCurrentReadOffset = event => {
    Keyboard.dismiss();

    if (!this.props.scheduledNext || this.state.loadingMore) {
      return;
    }
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    var isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    if (isCloseToBottom) {
      this.setState({ loadingMore: true });
      this.listScheduledBoops(this.props.scheduledNext).then(res => {
        this.props.addScheduled(res.data.boopsByUserIdStatusPlaytime);
        this.setState({ loadingMore: false });
      });
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.onUpdateBoopListRefresh();
  };

  updateBoopsPending = (boop, reply) =>{
    return this.props.updateSpecificBoopPending(boop)
  }

  updateBoopsActive = (boop, reply) => {
    return this.props.updateSpecificBoopActive(boop);
  }

  onUpdateBoopListRefresh = () => {
    this.listPendingBoops().then(pendingRes => {
      this.listScheduledBoops().then(scheduledRes => { 
        this.props.updatePending(pendingRes.data.boopsByUserIdStatusCreatedAt);
        this.props.updateScheduled(scheduledRes.data.boopsByUserIdStatusPlaytime);
        this.setState({ 
          refreshing: false
        });      
      });
    });
  }

  listPendingBoops = async(next=false) => {
    var input = { 
      boopUserRelationUserId: this.props.user.id, 
      statusCreatedAt: {
        between: [
          {
            status: "pending",
            createdAt: "2017",
          },
          {
            status: "pending",
            createdAt: "2020",
          }
        ]
      },
      filter: {
        playtime: {ge: moment().add(-3, "hours").toISOString()}
      },
      limit: 200,
      sortDirection: "DESC",
    }
    if(!!next) {input.nextToken = next;}
    return Query(Queries.listPendingBoops, {...input});
  }

  listScheduledBoops = async(next=false) => {
    var input = {
      boopUserRelationUserId: this.props.user.id, 
        statusPlaytime: {
          between: [
            {
              status: 'scheduled',
              playtime: moment().add(-3, "hours").toISOString()
            },
            {
              status: 'scheduled',
              playtime: moment().add(1, "year").toISOString()
            }
          ]
        },
        filter: {status: {eq: "scheduled"}},
        limit: 20,
        sortDirection: "ASC"
    };
    if(!!next) { input.nextToken = next; }
    return Query(Queries.listScheduledBoops, {...input});
  }

  listArchivedBoops = async(next=false) => {
    var input = {
      boopUserRelationUserId: user.attributes.sub,
      statusPlaytime: {
        beginsWith: {
          status: 'archived'
        }
      },
      limit: 20,
      sortDirection: "ASC"
    };
    if(!!next) { input.nextToken = next; }
    return Query(Queries.listArchivedBoops, {...input});
  }

}

const mapStateToProps = state => {
  const { pending, pendingNext, scheduled, scheduledChanged, scheduledNext, scheduledTotal, archived, archivedNext, archivedTotal } = state.boops;
  const { user } = state.user;
  
  return { pending, scheduled, user, pendingNext, scheduledChanged, scheduledNext, scheduledTotal, archived, archivedNext, archivedTotal };
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
)(BoopList);
const MyBoopsTitle = styled.Text`
  color: ${COLORS.PRIMARY};
  font-size: 18px;
  font-weight: bold;
  font-family: 'montserrat-bold';
  text-transform: uppercase;
`;
const NoneText = styled.Text`
  text-align: center;
  width: ${wp("80%")};
  color: ${COLORS.GREY};
  font-size: ${wp("3.8%")};
  margin-top: 30px;
  font-family: montserrat;
`;
const TryText = styled(NoneText)`
  margin-top: 10px;
  margin-bottom: 80px;
  color: ${COLORS.GREY};
`; 
const FirstBoopButton = styled(Button)`
  margin: 20px;
  justify-content: center;
  align-self: stretch;
`;
const NoneContent = styled.View`
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  height: ${hp("80%")}
  padding: 20px;
  font-family: 'montserrat-light';
`;
const IconView = styled(View)`
  margin-right: ${wp("1.2%")};
`;
const IconImage = styled(CachedImage)`
  width: 48px;
  height: 48px;
  border-radius: 25px;
`;
const ProgresView = styled.View`
flex: 1;
justify-content: flex-end;
align-items: center;
`
