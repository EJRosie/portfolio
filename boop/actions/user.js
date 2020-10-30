export default userActions = {
  setUser: "USER_ACTION_SET_USER",
  setGames: "USER_ACTION_SET_GAMES",
  scrub:  "USER_ACTION_DELETE_USER",
  setDevice: "USER_DEVICE",
  setUserProfilePicture: "USER_PROFILE_PICTURE",
  setUserPreferredUsername: "USER_PREFERRED_USERNAME",
  setTabVisibility: "TAB"
}

export function setUser(user) {
  return {
    type: userActions.setUser,
    user
  }
}
export function setTabVisibility(tab) {
  return {
    type: userActions.setTabVisibility,
    tab
  }
}
export function setUserProfilePicture(userProfilePicture) {
  return {
    type: userActions.setUserProfilePicture,
    userProfilePicture
  }
}
export function setUserPreferredUsername(preferredUsername) {
  return {
    type: userActions.setUserPreferredUsername,
    preferredUsername
  }
}
export function setDevice(device) {
  return {
    type: userActions.setDevice,
    device
  }
}
export function setGames(games) {
  return {
    type: userActions.setGames,
    games
  }
}

export function ScrubUser() {
  return {
    type: userActions.scrub,
  }
}