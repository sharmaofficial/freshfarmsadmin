import actions from "../actions";
const initialState = {
    list: [],
    rawList: [],
    loading: false,
  };
  
  const inventoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_INVENTORY_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case actions.SET_RAW_INVENTORY_LIST:
            return {
                ...state,
                rawList: action.payload,
            };
        case actions.SET_INVENTORY_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
  };
  
  export default inventoryReducer;
  