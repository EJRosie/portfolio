import moment from 'moment';


export default boopActions = {
  setPendingBoops: "BOOP_ACTION_SET_PENDING",
  setScheduledBoops: "BOOP_ACTION_SET_SCHEDULED",
  setArchivedBoops: "BOOP_ACTION_SET_ARCHIVED",
  updateSpecificBoopActive: "BOOP_ACTION_UPDATE_SPECIFIC_ACTIVE",
  updateSpecificBoopPending: "BOOP_UPDATE_SPECIFIC_PENDING",
  updateSpecificBoopArchived: "BOOP_UPDATE_SPECIFIC_ARCHIVED",


  AddBoopToScheduled: "BOOP_ACTION_ADD_TO_SCHEDULED",
  updatePendingBoop: "BOOP_ACTION_UPDATE_PENDING",
  updateArchivedBoop: "BOOP_ACTION_UPDATE_ARCHIVED",

  deleteSpecificBoop: "BOOP_ACTION_DELETE_SPECIFIC",
  addMoreScheduled: "BOOP_ACTION_ADD_MORE_SCHEDULED",
  addMoreArchived: "BOOP_ACTION_ADD_MORE_ARCHIVED",
}

export function setPendingBoops(boops) {
  return {
    type: boopActions.setPendingBoops,
    boops: boops.items,
    nextToken: boops.nextToken
  }
}
export function setScheduledBoops(boops) {
  const {sortedBoops, total} = sortBoops(boops);
  return {
    type: boopActions.setScheduledBoops,
    boops: sortedBoops,
    total,
    nextToken: boops.nextToken
  }
}
export function setArchivedBoops(boops) {
  const {sortedBoops, total} = sortBoops(boops);
  return {
    type: boopActions.setArchivedBoops,
    boops: sortedBoops,
    total,
    nextToken: boops.nextToken
  }
}
export function addMoreScheduled(boops) {
  const {sortedBoops, total} = sortBoops(boops);
  return {
    type: boopActions.addMoreScheduled,
    boops: sortedBoops,
    total,
    nextToken: boops.nextToken
  }
}
export function addMoreArchived(boops) {
  const {sortedBoops, total} = sortBoops(boops);
  return {
    type: boopActions.addMoreArchived,
    boops: sortedBoops,
    total,
    nextToken: boops.nextToken
  }
}

export function updateSpecificBoopPending(boop, reply) {
  return {
    type: boopActions.updateSpecificBoopPending,
    boop,
    day: moment(boop.boop.playtime).format("YYYYMMDD"),
    reply
  }
}
export function updateSpecificBoopActive(boop) {
  return {
    type: boopActions.updateSpecificBoopActive,
    boop,
    day: moment(boop.boop.playtime).format("YYYYMMDD")
  }
}
export function AddBoopToScheduled(boop) {
  return {
    type: boopActions.AddBoopToScheduled,
    boop
  }
}
export function updatePendingBoop(boop) {
  return {
    type: boopActions.updatePendingBoop,
    boop
  }
}
export function deleteSpecificBoop(boop) {
  return {
    type: boopActions.deleteSpecificBoop,
    boop,
    day: moment(boop.boop.playtime).format("YYYYMMDD")
  }
}




function sortBoops(boops) {
  var BoopDict = {};
  var total = 0;
  boops.items.map((boop) => {
    total = total + 1;
    var time = moment(boop.boop.playtime).format("YYYYMMDD")
    if(!(time in BoopDict)) {
      BoopDict[time] = [];
    }
    BoopDict[time].push(boop);
  });
  return {sortedBoops: BoopDict, total };
}