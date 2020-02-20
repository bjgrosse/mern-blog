import callApi from "../util/apiCaller";

// Export Constants
export const SET_USER = "SET_USER";
export const UPDATE_USER = "UPDATE_USER";
export const LOGOUT = "LOGOUT";

// Export Actions
export function setUser(user) {
  return {
    type: SET_USER,
    user: user
  };
}
// Export Actions
export function updateUser(data) {
  return {
    type: UPDATE_USER,
    data: data
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}
