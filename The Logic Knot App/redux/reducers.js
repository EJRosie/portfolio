const initialState = {
  leftCards: [],
  rightCards: []
}


const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'undefined':
      return initialState;

    case "addCardLeft":
      return Object.assign({}, state, {
        leftCards: [
          ...state.leftCards,
          {
            index: action.index,
            id: action.id,
            name: action.name,
            price: action.price,
            set: action.set,
          }
        ]
      })

    case "addCardRight":
      return Object.assign({}, state, {
        rightCards: [
          ...state.rightCards,
          {
            index: action.index,
            id: action.id,
            name: action.name,
            price: action.price,
            set: action.set,
          }
        ]
      })
      
    default:
      return state;
  }
}

export default reducer;
