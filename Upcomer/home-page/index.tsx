import * as React from "react";
import Router from 'next/router';
import { connect } from "react-redux";
import { Dispatch } from "redux";
// import {Grid} from '@material-ui/core/';
import styled from "styled-components";
import { IState } from "../../lib/state";
import {IStory} from '../../lib/api/models/story';
import { generateFullStorySlug } from "../../lib/seo/slug";
import moment from 'moment';


// API
import loadSocialFeed from "../../lib/actions/creators/home/load-social-feed";
import loadMatches from '../../lib/actions/creators/home/load-matches'
import loadLiveMatches from "../../lib/actions/creators/home/load-live-series";
import loadNewsFeed from "../../lib/actions/creators/home/load-news-feed";
import loadEvents from "../../lib/actions/creators/home/load-events";


// UI
import SocialFeed from './social-feed';
import MatchFeed from './matches';
import Events from './events';
import TrendingCard from "../common/cards/stories/trending";
import Feature from "../common/cards/stories/featured";
import { getGameById } from "../../lib/server/content/games";

const Container = styled.div`
  min-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;
const Grid = styled.div<{xs?: number, sm?: number, md?: number, lg?: number, xl?: number}>`
  padding: 0 10px;
  max-width: 100%;
  flex-basis: ${props => props.xs ? `${100 / 12 * props.xs}%` : "100%"};
  ${props => props.theme.screen.sm} {
    ${props => props.sm ? `flex-basis: ${100 / 12 * props.sm}%;` : ""}
  }
  ${props => props.theme.screen.md} {
    ${props => props.md ? `flex-basis: ${100 / 12 * props.md}%;` : ""}
  }
  ${props => props.theme.screen.lg} {
    ${props => props.lg ? `flex-basis: ${100 / 12 * props.lg}%;` : ""}
  }
  ${props => props.theme.screen.xl} {
    ${props => props.xl ? `flex-basis: ${100 / 12 * props.xl}%;` : ""}
  }
`;

const MatchesGrid = styled(Grid)`
  display: none;
  ${props => props.theme.screen.md} {
    display: block;
  }
`;

const NewsCol = styled(Grid)`
  ${props => props.theme.flexBox.column.center}
  margin-bottom: 20px;
`;
const TrendingContainer = styled.div`
  ${props => props.theme.flexBox.column.between};
  ${props => props.theme.screen.xs} {
    ${props => props.theme.flexBox.row.between};
  }
  color: ${props => props.theme.colors.whiteTrue};
  width: 100%;
  margin-top: 10px;
  margin-left: -5px;
  margin-right: -5px;
`;


const LatestNews = styled(Grid)`
  font-size: 16px;
  margin-bottom: 20px;
  ${props => props.theme.flexBox.column.start}
  &>h3 {
    width: 100%;
    ${props => props.theme.flexBox.row.between}
    color: ${props => props.theme.colors.whiteTrue};
    font-size: 1em;
    margin: 0;
    margin-bottom: 10px;
    border-bottom: 1px solid ${props => props.theme.colors.greyDark};
    padding-bottom: 10px;
    a {
      font-size: 0.9em;
      color: ${props => props.theme.colors.grey};
    }
  }
  &>ul {
    padding-left: 20px;
    li {
      padding-bottom: 10px;
      line-height: 1.3;
      &:nth-child(n+6) {
        display: none;
      }
      ${props => props.theme.screen.xs} {
        &:nth-child(n+6) {
          display: list-item;
        }
      }
    }
    a {
      font-size: 0.875em;
      font-weight: 600;
      letter-spacing: 0.25px;
      color: ${props => props.theme.colors.blueLight};
      width: 100%;
      &:hover {
        color: ${props => props.theme.colors.whiteTrue};
      }
    }
  }
`;

const timingNames = {
  M: "1mo",
  MM: "%dmo",
  d: "1d",
  dd: "%dd",
  future: "in %s",
  h: "1h",
  hh: "%dh",
  m: "1m",
  mm: "%dm",
  past: "%s ago",
  s: "%ds",
  ss: "%ds",
  y: "1y",
  yy: "%dy",
};

interface IHomeProps {
  games: number[];
}

interface IStateProps {
  gameIds: number[],
  location: any;
  currentGame: number;
  token: string | boolean;
  socialFeed: IStory[];
  featured: IStory[];
  trending: IStory[];
  latest: IStory[];
}

interface ILocalState {
  rendered: boolean;
}

interface IDispatchProps {
  onLoadSocialFeed: (gameIds: number[], token: string | boolean) => void;
  onLoadMatches: (gameIds: number[], token: string | boolean) => void;
  onLoadLiveMatches: (gameIds: number[], token: string | boolean) => void;
  onLoadNewsFeed: (gameIDs: number[], token: string | boolean) => void;
  onLoadTournaments: (gameIDs: number[], token: string | boolean) => void;

}

type IOwnProps = IHomeProps & IStateProps & IDispatchProps;

class Home extends React.PureComponent<IOwnProps, ILocalState> {
  public state: ILocalState = {
    rendered: false,
  };

  public componentDidMount() {
    moment.updateLocale("en", {
      relativeTime: timingNames,
    });
    // this.props.onLoadNewsFeed(this.props.gameIds, this.props.token);


    this.props.onLoadSocialFeed(this.props.gameIds, this.props.token);
    this.props.onLoadMatches(this.props.gameIds, this.props.token);
    this.props.onLoadLiveMatches(this.props.gameIds, this.props.token);
    this.props.onLoadTournaments(this.props.gameIds, this.props.token);
  }

  public render() {
    const gameSlug = getGameById(this.props.currentGame).slug;
    return (
      <Container md={10} sm={12} justify="center" direction="row" alignItems="flex-start" container spacing={24}>
          <NewsCol item xs={12} sm={7}> 
              {this.props.featured.map(story =>
                <Feature
                  published={story.published}
                  isSpoiler={story.spoiler && !story.reveal_results}
                  author={story.author}
                  story={story.data}
                  category={story.category}
                  commentCount={story.comments_data.total_count}
                />
              )}
            <TrendingContainer>
              {this.props.trending.map(story =>
                <TrendingCard
                  key={story.data.id}
                  published={story.published}
                  isSpoiler={story.spoiler && !story.reveal_results}
                  author={story.author}
                  story={story.data}
                  category={story.category}
                  commentCount={story.comments_data.total_count}
                />
              )}
            </TrendingContainer>
          </NewsCol>
          {this.props.latest && this.props.latest.length > 0 && 
          <LatestNews item xs={12} sm={3}>
            <h3>Latest News <a href={`/${gameSlug}/stories`}>All {`›`}</a></h3>
            <ul>
              {this.props.latest.map((story) => 
                <li><a href={generateFullStorySlug(story.data)}> {story.data.title} </a>  </li>
              )}
            </ul>
          </LatestNews>
          }
          <Grid item xs={12} md={6} sm={10}>
            <SocialFeed/>
          </Grid>
          <MatchesGrid item xs={12} md={4}>
            <MatchFeed/>
            <Events/>
          </MatchesGrid>

      </Container>
    );
  }

}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    gameIds: state.home.navMenu.currentGame === -2 ? [] :  state.home.navMenu.currentGame === -1 ? state.user.favoriteGames.ids  || [] : [state.home.navMenu.currentGame],
    currentGame: state.home.navMenu.currentGame,
    location: state.app.location,
    token: state.auth.token,
    socialFeed: state.home.socialFeed.items,
    featured: state.home.newsFeed.featured || [],
    trending: state.home.newsFeed.trending || [],
    latest: state.home.newsFeed.stories || [],
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  onLoadSocialFeed (gameIds: number[], token: string | boolean) {
    loadSocialFeed(gameIds, token, dispatch, 0).catch(e => {
      // TODO handle error
      return;});
  },
  onLoadMatches (gameIds: number[], token: string | boolean) {
    loadMatches(gameIds, token, dispatch).catch(e => {
      return;});
  },
  onLoadLiveMatches:  (gameIds: number[], token: string | boolean) => {
    loadLiveMatches(gameIds, token, dispatch).catch(e => {
      // TODO handle error
      return;});
  },
  onLoadNewsFeed: (gameIds: number[], token: string | boolean) => {
    loadNewsFeed(gameIds, token, dispatch).catch(e => {
      // TODO handle error
      return;});
  },
  onLoadTournaments: (gameIds: number[], token: string | boolean) => {
    loadEvents(gameIds, token, dispatch).catch(e => {
      // TODO handle error
      return;});
  },
});

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Home);
