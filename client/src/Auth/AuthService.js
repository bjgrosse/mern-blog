import jwt_decode from "jwt-decode";
import callApi from "../util/apiCaller";
import * as actions from "./AuthActions";
import { refreshPosts } from "Post/PostService";

function processToken(token) {
  const decoded = jwt_decode(token);

  // if it's not expired...
  const currentTime = Date.now() / 1000;
  if (decoded.exp > currentTime) {
    return decoded;
  } else {
    logout();
  }
}
export function initialize(dispatch) {
  // Check for token to keep user logged in
  const token = localStorage.jwtToken;

  if (token && processToken(token)) {
    dispatch(actions.setUser(JSON.parse(localStorage.user)));
  }
}

export function registerUser(data, dispatch) {
  return callApi("users/register", "POST", data).then(result => {
    localStorage.jwtToken = result.token;
    localStorage.user = JSON.stringify(result.user);
    initialize(dispatch);
    return result.user;
  });
}
export function login(data, dispatch) {
  return callApi("users/login", "POST", data).then(result => {
    localStorage.jwtToken = result.token;
    localStorage.user = JSON.stringify(result.user);
    initialize(dispatch);
    return result.user;
  });
}

export function updateUser(data, dispatch) {
  return callApi("users/update", "POST", data).then(result => {
    localStorage.user = JSON.stringify(data);
    initialize(dispatch);
    refreshPosts(dispatch);
  });
}

export function checkEmail(email) {
  return callApi("users/checkEmail", "POST", { email });
}

export function getAuthToken() {
  return localStorage.jwtToken;
}

export function logout(dispatch) {
  localStorage.jwtToken = "";
  localStorage.user = "";
  dispatch(actions.logout());
}
