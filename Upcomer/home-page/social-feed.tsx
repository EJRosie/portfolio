import * as React from "react";
import Router from 'next/router';
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import { IState } from "../../lib/state";
import {IStory} from '../../lib/api/models/story';
import ReactGA from 'react-ga';

// API
import loadSocialFeed from "../../lib/actions/creators/home/load-social-feed";
import upvotePost from '../../lib/actions/creators/community/upvote-post';
import unvotePost from '../../lib/actions/creators/community/unvote-post';
import assembleAction from "../../lib/actions";
import AuthActions, {
  AuthModalSection,
  IToggleAuthModal,
} from "../../lib/actions/auth";

// UI 
import InfiniteScroll from "react-infinite-scroller";
import SocialCard from '../common/cards/social';
import AppAd from '../common/cards/social/app-ad';
import {Modal, Slide} from "@material-ui/core/";
import Post from '../feed-posts';
import { generateFullFeedSlug } from "../../lib/seo/slug";
import {NAVBAR_HEIGHT, MOBILE_NAV_HEIGHT} from '../common/nav/components';


const PostModal = styled(Modal)`
  && {
    z-index: 102;
    margin-top: ${MOBILE_NAV_HEIGHT};
    ${props => props.theme.screen.desktopMenu} {
      margin-top: ${NAVBAR_HEIGHT};
    }
    overflow-y: auto;
  }
`;
const Title = styled.h2`
  font-size: 24px;
  line-height: 27px;
  font-family: ${props => props.theme.fonts.secondary};
  color: ${props => props.theme.colors.whiteTrue};
`;
interface IStateProps {
  gameIds: number[],
  location: any;
  hideResults: boolean,
  token: string | boolean;
  socialFeed: IStory[];
  loading: boolean;
  next: string | null;
}

interface ILocalState {
  rendered: boolean;
  showModal: boolean;
  modalContent: IStory | null;
  oldURL: string;
}

interface IDispatchProps {
  loadMoreSocialFeed: (gameIds: number[], token: string | boolean, page: number) => void;
  onUpvotePost: (postID: number, token: string | boolean) => void;
  onUnvotePost: (postID: number, token: string | boolean) => void;
}

type IOwnProps = IStateProps & IDispatchProps;

class Home extends React.PureComponent<IOwnProps, ILocalState> {
  public state: ILocalState = {
    rendered: false,
    showModal: false,
    modalContent: null,
    oldURL: ""
  };

  public render() {
    return (
      <div>
          <PostModal
            open={this.state.showModal}
            onClose={() => this.onModalClose()}
          >
            <Slide direction="down" in={this.state.showModal} mountOnEnter unmountOnExit>
              <Post closeModal={() => this.onModalClose()} isModal={true} post={this.state.modalContent}>CONTENT MODAL!</Post>
            </Slide>
          </PostModal>
        <Title>
          Trending
        </Title>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore.bind(this)}
          hasMore={!this.props.loading && !!this.props.next}
          useWindow={true}
          threshold={1000}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          {this.props.socialFeed.map((item, index) => (
            <>
              {index > 0 && index % 10 === 0 && <AppAd/>}
              <SocialCard token={this.props.token} openModal={this.loadModal.bind(this)} key={item.data.id} item={item} hide={this.props.hideResults} voteOnPost={this.voteOnPost.bind(this)}/>
            </>
          ))}
        </InfiniteScroll>
      </div>
    );
  }

  private loadMore(page: number) {
    this.props.loadMoreSocialFeed(this.props.gameIds, this.props.token, page);
  }
  
  private loadModal = (content: IStory) => {
    const href = window.location.href;
    const as = generateFullFeedSlug(content.data);
    this.setState({
      showModal: true,
      oldURL: href
    });
    history.pushState({}, href, as);
    ReactGA.ga('send', 'pageview', as);
    this.setState({showModal: true, modalContent: content})
  }
  
  private onModalClose = () => {
    history.pushState({}, this.state.oldURL, this.state.oldURL);
    this.setState({showModal: false, modalContent: null})
  }

  private voteOnPost = (event: React.MouseEvent, postID: number, state: string) => {
    event.preventDefault();
    event.stopPropagation();
    if(state === "upvoted") {
      return this.props.onUnvotePost(postID, this.props.token);
    }
    else {
      return this.props.onUpvotePost(postID, this.props.token);
    }
  }
}

const mapStateToProps = (state: IState): IStateProps => {
  return {
    hideResults: !state.user.profile.showResults,
    gameIds: state.home.navMenu.currentGame === -2 ? [] :  state.home.navMenu.currentGame === -1 ? state.user.favoriteGames.ids  || [] : [state.home.navMenu.currentGame],
    location: state.app.location,
    token: state.auth.token,
    socialFeed: state.home.socialFeed.items,
    loading: state.home.socialFeed.loading,
    next: state.home.socialFeed.next
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  const showSignUpModal = () => {
    dispatch(
      assembleAction<IToggleAuthModal>(AuthActions.ToggleAuthModal, {
        section: AuthModalSection.SignUp,
        show: true,
      })
    );
  };
  return {
    loadMoreSocialFeed (gameIds: number[], token: string | boolean, page: number) {
      loadSocialFeed(gameIds, token, dispatch, page).catch(e => {
        // TODO handle error
        Router.push({ pathname: "/error", query: { code: 500 },},  window.location.pathname);      });
    },
    onUpvotePost: (postID: number, token: string | boolean) => {
      if (!token) {
        return showSignUpModal();
      }
      return upvotePost({id: postID, token}, dispatch)
        .then(() => {
          return Promise.resolve();
        });
    },
    onUnvotePost: (postID: number, token: string | boolean) => {
      if (!token) {
        return showSignUpModal();
      }
      return unvotePost({id: postID, token}, dispatch)
        .then(() => {
          return Promise.resolve();
        });
    },
  }
};

export default connect<IStateProps, IDispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(Home);
