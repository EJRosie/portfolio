import { ICompletedSeries, IUpcomingSeries, IAllMatches } from "../../../lib/api/models/series";
import React, { Component, Fragment } from "react";
import { ComponentClass } from "react";
import Router from 'next/router';
import ReactGA from 'react-ga';

// UI
import Button from "react-bootstrap/lib/Button";
import { connect } from "react-redux";
import styled from "styled-components";
import LoadingContainer from "../common/loading-container";
import assembleAction from "../../lib/actions";
import NavDropdown from "react-bootstrap/lib/NavDropdown";
import AuthActions, {
  AuthModalSection,
  IToggleAuthModal,
} from "../../lib/actions/auth";
import loadMatches from "../../lib/actions/creators/home/load-all-matches";
import { IState } from "../../lib/state";
// UI
import TabbedContent from '../common/tabs-container';
import {IMatchDay} from "../../lib/api/models/series";
import Day from './parts/day';
import InfiniteScroll from "react-infinite-scroller";
import { getGameById } from "../../lib/server/content/games";
import ResetMatches from "../../lib/actions/creators/tournament/reset-matches";


const Tabbed = styled(TabbedContent)`

`;
const MobileFilterDropdown = styled(NavDropdown)`
  list-style-type: none;
  width: 135px;
  height: 35px;
  padding: 10px;
  font-size: 12px;
  background-color: ${props => props.theme.colors.blackLight};
  border-radius: 5px;
  ${props => props.theme.flexBox.row.between}
  a, span {
    color: ${props => props.theme.colors.whiteTrue};
  }
  i {
    transition: transform ease 0.5s;
  }
  &.open i {
    transform: rotateX(180deg);
  }
  .dropdown-toggle {
    height: 32px;
    width: 100%;
    ${props => props.theme.flexBox.row.between} 
  }
  ul button {
    font-size: 12px;
    width: 100%;
    text-align: left;
  }
  &.open ul {
    left: 0;
    min-width: unset;
    ${props => props.theme.flexBox.column.start}
    background-color: ${props => props.theme.backgroundColors.card.main};
    li {
      color: white;
    }
  }
`;
const EventTitle = styled.h3`
  color: white;
  margin-left: 10px;
  font-family: ${props => props.theme.fonts.secondary};
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 32px; 
  white-space: nowrap;
  &>span {
    display: none;
    ${props => props.theme.screen.sm} {
      display: inline-block;
    }
    margin-right: 5px;
  }
`;

const GameLogo = styled.img`
  width: 26px;
  height: 26px
  margin-right: 5px;
`;

const Separator = styled.div`
  height: 1px;
  width: 100%;
  border: 1px solid #4A4B61;
  margin-bottom: 30px;
`;

const TabButton: ComponentClass<
  { active: boolean; onClick: () => void } & Button.ButtonProps
> = styled(Button)`
  border: none;
  background-color: ${props =>
    props.active
      ? props.theme.series.filters.tabBackgroundActive
      : props.theme.series.filters.tabBackground} !important;
  color: ${props =>
    props.active
      ? props.theme.series.filters.tabFontColorActive
      : props.theme.series.filters.tabFontColor} !important;
  padding: 5px 10px;
  border-radius: 0;
  border-radius: 100px;
  font-size: 14px;
  &:hover {
    color: ${props => props.theme.colors.white} !important;
  }
`;
const TitleContainer = styled.div`
  ${props => props.theme.flexBox.row.between}
`;

enum Tabs {
  Upcoming = "upcoming",
  Results = "results"
}
const tabs = [
  {label : `Today ${"&"} Upcoming`, value: Tabs.Upcoming},
  {label : "Past Results", value: Tabs.Results}
]
enum Filters {
  Top = "top-events",
  All = "all-events",
  MyTeams = "my-teams"
}
const filterTabs = [
  { label: "Top Events", value: Filters.Top },
  { label: "All Events", value: Filters.All },
  { label: "My Teams & Players", value: Filters.MyTeams },
];

interface ILocalProps {
  gameId: number;
  useFavorites: boolean;
  loading: boolean;
  token: string | boolean;
  hideResults: boolean;
  tab: string;
  filter: string;
  windowSize: number;
}

interface IDispatchProps {
  showSignUpModal: () => void;
  onLoadMatches: (gameId: number[] | string, token: string | boolean, tab: Tabs, filter: Filters) => void;
  onLoadMoreMatches: (gameId: number[] | string, token: string | boolean, tab: Tabs, filter: Filters, call?: string) => void;
}

interface IStateProps {
  completedMatches: IMatchDay[];
  upcomingMatches: IMatchDay[];
  matches: IAllMatches;
  prev: string;
  next: string;
  currentGame: number;
}

type IProps = ILocalProps & IStateProps & IDispatchProps;


class Matches extends Component<IProps> {
  public state = {
    showTournamentDetails: false,
    tab: this.props.tab === "results" ? Tabs.Results : Tabs.Upcoming,
    activeFilter: filterTabs.filter(item => item.value === this.props.filter)[0] || filterTabs[0],
    nextPage: 1,
    loading: false,
    game: getGameById(this.props.gameId),
    filterTitle: "Top Events"
  };
  public componentDidUpdate(prevProps) {
    if((!prevProps.prev && this.props.prev) || (!prevProps.next && this.props.next)) {
      this.LoadMoreMatches(0);
    }
  }

  public render() {
    return (
      <>
      <LoadingContainer
      loading={!this.props.matches || !this.props.windowSize}
      component={() => {
        return (
          <>
            <TitleContainer>
              {this.getTitle()}
              {this.getFilter()}
            </TitleContainer>
            <Tabbed
              sticky
              tab={this.state.tab === "results" ? 1 : 0}
              onChange={this.onTabChange}
              tabs={[tabs[0].label, tabs[1].label]}
              views={this.getViews()}
              id="all-matches-view"
            />
          </>
        );}}
        />
      </>
    );
  }

  private onTabChange = (tabNo: number) => {
    const tab = tabs[tabNo];
    this.setState({tab: tab.value});
    const token = this.props.token;
    const {gameId, useFavorites} = this.props;
    const filter = this.state.activeFilter;
    const game = (useFavorites && token) ? "my-games" : gameId ? [gameId] : "all-games";
    this.props.onLoadMatches(game, token, tab.value, filter.value);
    this.updateURL(tab.value, filter.value);
    ReactGA.event({
      category: "Matches",
      action: "Tab Click",
      label: 'Matches Page Nav Click',
      nonInteraction: true
    });
  }

  private getTitle = () => {
    const {gameId, useFavorites} = this.props;
    const gameName = useFavorites ? "My Games" : gameId ? getGameById(gameId).short_name : "All Games";
    const {game} = this.state
    return (
      <EventTitle>
        {game.abios_game_images && <GameLogo src={game.abios_game_images.square}/>}
        <span>{gameName}</span> Matches
      </EventTitle>
    )
  }
  private getFilter = () => {
    return (
      <MobileFilterDropdown
        eventKey="filters"
        title={<>{this.state.activeFilter.label} <i className="fas fa-chevron-down"></i></>}
        id="matches-filters-dropdown"
        noCaret
      >
        {filterTabs.map(tab => {        
          return (
            <TabButton
              key={tab.value}
              active={this.state.activeFilter === tab}
              onClick={() => {
                if (this.state.activeFilter !== tab) {
                  this.switchFilter(tab);
                }
              }}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </MobileFilterDropdown>
    );
  }


  private switchFilter = (filter: any) => {
    if(filter.value === Filters.MyTeams && !this.props.token) {
      return this.props.showSignUpModal();
    }
    this.setState({activeFilter: filter});
    if(this.props.loading) {return;}
    const tab = this.state.tab
    const token = this.props.token;
    const {gameId, useFavorites} = this.props;
    const game = (useFavorites && token) ? "my-games" : gameId ? [gameId] : "all-games";
    this.props.onLoadMatches(game, token, tab, filter.value);
    this.updateURL(tab, filter.value);
  }

  private updateURL = (tabVal: string, filterVal: string) => {
    const path = window.location.pathname;
    Router.replace(
      {pathname: "/matches",
      query: {
        tab: tabVal,
        filter: filterVal,
        id: this.props.gameId
      }},
      `${path}?tab=${tabVal}&filter=${filterVal}`, 
      {shallow: true}
    );
  }


  private LoadMoreMatches = (page: number) => {
    if(this.props.loading) {return;}
    const tab = this.state.tab
    const call =  tab === Tabs.Upcoming ? this.props.next : this.props.prev;
    if(call === null || call === undefined) { return;}
    const token = this.props.token;
    const filter = this.state.activeFilter;
    const {gameId, useFavorites} = this.props;
    const game = (useFavorites && token) ? "my-games" : gameId ? [gameId] : "all-games";
    this.props.onLoadMoreMatches(game, token, tab, filter.value, call);
  }

  private getViews = () => {
    const {game} = this.state;
    return [
      <InfiniteScroll
        pageStart={0}
        loadMore={this.LoadMoreMatches}
        hasMore={!!this.props.next}
        useWindow={true}
        key={"upcoming-matches"}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
        {(this.props.upcomingMatches || []).map((match: IMatchDay, index: number) => 
          <>
          <Day windowSize={this.props.windowSize} day={match} key={index + "U"} gameSlug={game.slug}/>
          <Separator></Separator>
          </>
        )}
        </InfiniteScroll>,

        <InfiniteScroll
        pageStart={0}
        loadMore={this.LoadMoreMatches}
        hasMore={!!this.props.prev}
        useWindow={true}
        key={"completed-matches"}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
      >
      {(this.props.completedMatches || []).map((match: IMatchDay, index: number) => 
        <>
        <Day windowSize={this.props.windowSize} day={match} key={index + "C"} gameSlug={game.slug}/>
        <Separator></Separator>
        </>
      )}
      </InfiniteScroll>
    ]
  }
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    currentGame: state.home.navMenu.currentGame,
    completedSeries: state.tournament.completedSeries.series,
    upcomingSeries: state.tournament.upcomingSeries.series,
    matches: state.home.matches,
    loading: state.home.matches.loading || state.home.matches.error,
    upcomingMatches: state.home.matches.upcoming,
    completedMatches:  state.home.matches.completed,
    prev: state.home.matches.prev,
    next: state.home.matches.next
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    showSignUpModal: () => {
      dispatch(
        assembleAction<IToggleAuthModal>(AuthActions.ToggleAuthModal, {
          section: AuthModalSection.SignUp,
          show: true,
        })
      );
    },
    onLoadMatches(gameId: number[] | string, token: string | boolean, tab: Tabs, filter: Filters) {
      ResetMatches(dispatch);
      loadMatches(gameId, token, tab, filter, dispatch);
    },
    onLoadMoreMatches(gameId: number[] | string, token: string | boolean, tab: Tabs, filter: Filters, call?: string) {
      // ReactGA Event?
      loadMatches(gameId, token, tab, filter, dispatch, call);
    },
  };
};

export default connect<IStateProps>(mapStateToProps, mapDispatchToProps)(Matches);
