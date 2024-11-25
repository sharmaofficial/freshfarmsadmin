import actions from "../actions";
const initialState = {
    list: [],
    rawList: [],
    loading: false,
  };
  
  const packageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.SET_PACKAGES_LIST:
            return {
                ...state,
                list: action.payload,
            };
        case actions.SET_RAW_PACKAGES_LIST:
            console.log("action.payload", action.payload);
            return {
                ...state,
                rawList: action.payload,
            };
        case actions.SET_PACKAGES_LOADING:
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
  };
  
  export default packageReducer;
  