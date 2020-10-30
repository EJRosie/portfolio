export default friendActions = {
  setFriends: "FRIEND_ACTION_SET_FRIENDS",
  removeFriend: "FRIEND_ACTION_REMOVE_FRIENDS",
  requestFriend: "FRIEND_ACTION_ADD_FRIEND_REQUEST",
  setRequests: "FRIEND_ACTION_SET_FRIEND_REQUESTS",
  deleteRequest: "FRIEND_ACTION_DELETE_FRIEND_REQUESTS",
  acceptRequest: "FRIEND_ACTION_ACCEPT_FRIEND_REQUESTS",
  addMoreFriends: "FRIEND_ACTION_ADD_MORE_FRIENDS",
  addOutgoingRequest: "FRIEND_ACTION_ADD_OUTGOING_REQUEST",
  setBlocks: "FRIEND_ACTION_SET_BLOCKS",
  addBlock: "FRIEND_ACTION_ADD_BLOCK",
  deleteBlock: "FRIEND_ACTION_DELETE_BLOCK",
}

export function setFriends(friends) {
  return { type: friendActions.setFriends, friends: friends.items, friendsNext: friends.nextToken }
}
export function removeFriend(friend) {
  return { type: friendActions.removeFriend, friend }
}
export function setFriendRequests(requests) {
  return { type: friendActions.setRequests, requests: requests.items, requestsNext: requests.nextToken }
}
export function requestFriend(request) {
  return { type: friendActions.requestFriend, request: request.items }
}
export function acceptRequest(request) {
  return { type: friendActions.acceptRequest, request }
}
export function deleteRequest(request) {
  return { type: friendActions.deleteRequest, request }
}
export function addMoreFriends(friends) {
  return { type: friendActions.addMoreFriends, friends: friends.items, friendsNext: friends.nextToken }
}
export function addOutgoingRequest(request) {
  return { type: friendActions.addOutgoingRequest, request }
}
export function setBlocks(blocks) {
  return { type: friendActions.setBlocks, blocks }
}
export function addBlock(block) {
  return { type: friendActions.addBlock, block }
}
export function deleteBlock(block) {
  return { type: friendActions.deleteBlock, block }
}
