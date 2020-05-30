import axios from "axios";

const USER_LOGIN = "USER_LOGIN";
const USER_SIGNUP = "USER_SIGNUP";

export const USER_LOGOUT = "USER_LOGOUT";
export const USER_LOGIN_FULFILLED = "USER_LOGIN_FULFILLED";
export const USER_LOGIN_REJECTED = "USER_LOGIN_REJECTED";
export const TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE";
export const SET_DARK_MODE = "SET_DARK_MODE";

const ROOT_URL = "https://alexsblogapi.herokuapp.com";

export function userSignup(signUpData, callback) {
  const request = axios({
    baseURL: ROOT_URL,
    url: "/user/signup",
    method: "POST",
    data: signUpData
  }).then(() => callback());
  return {
    type: USER_SIGNUP,
    payload: request
  };
}

//Combines redux-promise-middleware and redux thunk to
//chain async actions and perform side effects
//See https://docs.psb.codes/redux-promise-middleware/guides/chaining-actions
export function userLogin(loginData, callback) {
  return dispatch => {
    const request = axios({
      baseURL: ROOT_URL,
      url: "/user/login",
      method: "POST",
      data: loginData
    });
    return dispatch({
      type: USER_LOGIN,
      payload: request
    }).then(({ value }) => {
      //The reason to use thunk is because
      //  1. We need the jwt token returned by the server to be saved to localStorage,
      //     which is available only when the promise resolves,
      //  2. Reducers must be kept PURE,
      //     i.e. we can't do side effects (like saving tokens to localStorage) in them
      localStorage.setItem("username", value.data.username);
      localStorage.setItem("token", value.data.token);
      callback();
    });
  };
}

//Simply remove token and username from localStorage
export function userLogout(callback) {
  return dispatch => {
    dispatch({ type: USER_LOGOUT });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    callback();
  };
}

export function toggleDarkMode() {
  return dispatch => {
    dispatch({ type: TOGGLE_DARK_MODE });
  };
}

export function setDarkMode(setting) {
  return dispatch => {
    dispatch({ type: SET_DARK_MODE, payload: setting });
  };
}
