import checkIfExpired from "../middlewares/checkTokenExpired";
import axios from "axios";
import { Dispatch } from "../store";
import {
  UserState,
  SignupPayload,
  LoginPayload,
  LogoutPayload,
  UserResponse
} from "UserTypes";

const ROOT_URL = "https://alexsblogapi.herokuapp.com";

export const user = {
  state: {
    isAuthenticated: !checkIfExpired(),
    username: localStorage.getItem("username"),
    isDarkMode: false
  },
  reducers: {
    userLogin: (
      state: UserState,
      payload: { username: string; isAuthenticated: boolean }
    ) => ({
      ...state,
      ...payload
    }),
    userLogout: (state: UserState) => ({
      ...state,
      isAuthenticated: false,
      username: null
    }),
    toggleDarkModeState: (state: UserState) => ({
      ...state,
      isDarkMode: !state.isDarkMode
    }),
    setDarkModeState: (state: UserState, payload: boolean) => ({
      ...state,
      isDarkMode: payload
    })
  },
  effects: (dispatch: Dispatch) => ({
    async userSignup(payload: SignupPayload, state: UserState) {
      const { signupData, callback } = payload;
      dispatch.isPending.setIsPending(true);

      await axios({
        baseURL: ROOT_URL,
        url: "/user/signup",
        method: "POST",
        data: signupData
      });

      dispatch.isPending.setIsPending(false);
      callback();
    },

    async login(payload: LoginPayload, state: UserState) {
      const { loginData, callback } = payload;
      dispatch.isPending.setIsPending(true);

      const res = await axios({
        baseURL: ROOT_URL,
        url: "/user/login",
        method: "POST",
        data: loginData
      });

      const data: UserResponse = res.data;
      dispatch.isPending.setIsPending(false);
      dispatch.user.userLogin({
        username: data.username,
        isAuthenticated: true
      });
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);
      callback();
    },

    //Simply remove token and username from localStorage
    logout(payload: LogoutPayload, state: UserState) {
      const { callback } = payload;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      dispatch.user.userLogout();
      callback();
    },

    toggleDarkMode() {
      dispatch.user.toggleDarkModeState();
    },

    setDarkMode({ setting }: { setting: boolean }) {
      dispatch.user.setDarkModeState(setting);
    }
  })
};
