import { SET_USER, LOGOUT, UPDATE_USER } from "./AuthActions";

// Initial State
const initialState = { user: null, isAuthenticated: false };

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.user,
        isAuthenticated: action.user ? true : false
      };
    case UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.data } };
    case LOGOUT:
      return initialState;

    default:
      return state;
  }
};

/* Selectors */

// Export Reducer
export default AuthReducer;
