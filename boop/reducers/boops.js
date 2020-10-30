import boopActions from '../actions/boops';

const INITIAL_STATE = {
  pending: [],
  pendingNext: null,
  active: [],
  activeNext: null,
  activeChanged: null,
  scheduled: {},
  scheduledNext: null,
  scheduledTotal: 0,
  scheduledChanged: null,
  archived: {},
  archivedNext: null,
  archivedTotal: 0
};

export default boopReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case boopActions.setPendingBoops:
      return { ...state, pending: action.boops, pendingNext: action.nextToken }

      case boopActions.setScheduledBoops:
      return { 
        ...state, 
        scheduled: action.boops, 
        scheduledNext: action.nextToken,
        scheduledTotal: action.total,
        scheduledChanged: new Date().toISOString(),
      }

    case boopActions.setArchivedBoops:
        return { 
          ...state, 
          archived: action.boops, 
          archivedNext: action.nextToken,
          archivedTotal: action.total
        }

    case boopActions.addMoreScheduled:
      const newBoops = Object.assign({}, state.scheduled);
      Object.keys(action.boops).map((date) => {
        if(!(date in newBoops)) {      newBoops[date] = action.boops[date];      }
        else {     newBoops[date].push(...action.boops[date]);      }
      });
      return {
        ...state, 
        scheduled: newBoops, 
        scheduledNext: action.nextToken,
        scheduledTotal: state.scheduledTotal + action.total,
        scheduledChanged: new Date().toISOString()
      }

    case boopActions.addMoreArchived:
      const newArchived = Object.assign({}, state.archived);
      Object.keys(action.boops).map((date) => {
        if(!(date in newArchived)) {      newArchived[date] = action.boops[date];      }
        else {     newArchived[date].push(...action.boops[date]);      }
      });
      return {
        ...state, 
        archived: newArchived, 
        archivedNext: action.nextToken,
        archivedTotal: state.archivedTotal + action.total
      }

    case boopActions.updateSpecificBoopActive:
      var newDay = state.scheduled[action.day].map((item, index) => {
        if(item.boop.id !== action.boop.boop.id) {
          return item;
        }
        return {
          ...item,
          ...action.boop
        }
      });
      return {
        ...state, 
        scheduled: {
          ...state.scheduled,
          [action.day]: newDay
        },
        scheduledChanged: new Date().toISOString()
      };

    case boopActions.updateSpecificBoopPending: 
      var pending = [...state.pending];
      const date = action.day;
      const index = pending.findIndex(item =>
        item.boop.id === action.boop.boop.id
      );

      if (index > -1) {
        if (!!action.reply && (action.reply == 'yes' || action.reply == 'later')) {
          let newBoops = Object.assign({}, state.scheduled);

          if(date in newBoops) newBoops[date] = [action.boop, ...newBoops[date]];
          else newBoops[date] = [action.boop];

          pending.splice(index, 1);

          return {
            ...state,
            pending: pending,
            scheduled: newBoops,
            scheduledTotal: state.scheduledTotal + 1,
            scheduledChanged: new Date().toISOString()
          }

        } else if (!!action.reply && action.reply == 'no') {
          let newArchived = Object.assign({}, state.archived);

          if(date in newArchived) newArchived[date] = [action.boop, ...newArchived[date]];
          else newArchived[date] = [action.boop];

          pending.splice(index, 1);

          return {
            ...state, 
            pending: pending,
            archived: newArchived, 
            archivedNext: action.nextToken,
            archivedTotal: state.archivedTotal + action.total
          }
        }
      }

      return state;

    // var updatedPending = state.pending.filter((item, index) => 
    //          item.id !== action.boop.id  );
    //          return { ...state, pending: [action.boop, ...updatedPending], pendingNext: action.nextToken }
    case boopActions.AddBoopToScheduled:
      return { ...state, active: [action.boop, ...state.active] }

    case boopActions.updatePendingBoop:
      return { ...state, pending: [action.boop, ...state.pending] }

    case boopActions.deleteSpecificBoop:
        var deletedPending = state.pending.filter(item => item.boop.id !== action.boop.boop.id);
        var newDay = state.scheduled[action.day].filter(item => item.boop.id !== action.boop.boop.id);
        const newState = {
          ...state, 
          scheduled: {
            ...state.scheduled,
            [action.day]: newDay
          },
          scheduledChanged: new Date().toISOString(),
          pending: deletedPending
        };

        if(newState.scheduled[action.day].length < 1) {
          delete(newState.scheduled[action.day]);
        }
        return newState;
          

    default:
      return state
  }
};
