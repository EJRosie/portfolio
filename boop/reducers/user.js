import userActions from "../actions/user";

const INITIAL_STATE = {
  user: null,
  device: null,
  games: [],
  tab: true
};

export default (userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userActions.setUser:
      return { ...state, user: action.user };
    case userActions.setUserProfilePicture:
      return { ...state, userProfilePicture: action.userProfilePicture };
    case userActions.setUserPreferredUsername:
      return { ...state, preferredUsername: action.preferredUsername };
    case userActions.setTabVisibility:
      return { ...state, tab: action.tab };
    case userActions.setGames:
      return { ...state, games: action.games };
    case userActions.scrub:
      return INITIAL_STATE;
    case userActions.setDevice:
      return { ...state, device: action.device };
    default:
      return state;
  }
});
