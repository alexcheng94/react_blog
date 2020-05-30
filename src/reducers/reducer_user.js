import {
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED,
  USER_LOGOUT,
  TOGGLE_DARK_MODE,
  SET_DARK_MODE
} from "../actions/user";

import checkIfExpired from "../middlewares/checkTokenExpired";

const initialUserState = {
  //Check user auth state immediately when app boots up
  isAuthenticated: !checkIfExpired(),
  username: localStorage.getItem("username"),
  isDarkMode: false
};

const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case USER_LOGIN_REJECTED:
      return {
        ...state,
        isAuthenticated: false
      };
    case USER_LOGIN_FULFILLED:
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.data.username
      };
    case USER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        username: null
      };
    case TOGGLE_DARK_MODE:
      return {
        ...state,
        isDarkMode: !state.isDarkMode
      };
    case SET_DARK_MODE:
      return {
        ...state,
        isDarkMode: action.payload
      };
    default:
      return state;
  }
};
export default userReducer;
