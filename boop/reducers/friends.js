import friendActions from '../actions/friends';

const INITIAL_STATE = {
  friends: [],
  friendsNext: null,
  requests: [],
  requestsNext: null,
  outgoingRequests: [],
  outgoingRequestsNext: null,
  blocks: [],
  blocksNext: null,
};

export default friendReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case friendActions.setFriends:
      blockOtherUserIds = [];
      state.blocks.forEach(block => {blockOtherUserIds.push(block.blockee.id)});
      friendsWithoutBlock = action.friends.filter(friend => !(friend.otherUser.id in blockOtherUserIds));
      return {...state, friends: friendsWithoutBlock, friendsNext: action.friendsNext};
    case friendActions.addMoreFriends:
      blockOtherUserIds = [];
      state.blocks.forEach(block => {blockOtherUserIds.push(block.blockee.id)});
      moreFriendsWithoutBlock = action.friends.filter(friend => !(friend.otherUser.id in blockOtherUserIds));
      return {...state, friends: [...state.friends, ...moreFriendsWithoutBlock], friendsNext: action.friendsNext};
    case friendActions.setRequests:
      return {...state, requests: action.requests,  requestsNext: action.requestsNext};
    case friendActions.requestFriend:
      // return {...state, requests: [action.request, ...state.requests]}
      return {...state, outgoingRequests: action.request,  requestsNext: action.requestsNext};
    case friendActions.addOutgoingRequest:
      return {...state, outgoingRequests: [action.request, ...state.outgoingRequests],  requestsNext: action.requestsNext};
    case friendActions.acceptFriend:
      blockOtherUserIds = [];
      state.blocks.forEach(block => {blockOtherUserIds.push(block.otherUser.id)});
      if (!(action.request.otherUser.id in blockOtherUserIds))
        return {...state, friends: [...action.request, ...state.friends]};
      else
        return state;
    case friendActions.deleteRequest:
      const listWithoutRequest = state.requests.filter(req => req.id !== action.request.id);
      const outgoingsWithoutRequest = state.outgoingRequests.filter(req => req.id !== action.request.id);
      return {...state, requests: listWithoutRequest, outgoingRequests: outgoingsWithoutRequest};
    case friendActions.removeFriend:
      const listWithoutFriend = state.friends.filter(friend => friend.id !== action.friend.id);
      return {...state, friends: listWithoutFriend};
    case friendActions.setBlocks:
      blockOtherUserIds = [];
      action.blocks.forEach(block => {blockOtherUserIds.push(block.blockee.id)});
      friendsWithoutBlock = state.friends.filter(friend => !(friend.otherUser.id in blockOtherUserIds));
      return {...state, blocks: action.blocks, friends: friendsWithoutBlock};
    case friendActions.addBlock:
      friendsWithoutBlock = state.friends.filter(friend => friend.otherUser.id !== action.block.blockee.id);
      return {...state, blocks: [action.block, ...state.blocks], friends: friendsWithoutBlock};
    case friendActions.removeBlock:
      blocksWithoutBlock = state.blocks.filter(block => block.id !== action.block.id);
      return {...state, blocks: blocksWithoutBlock}
    default:
      return state
  }
};
