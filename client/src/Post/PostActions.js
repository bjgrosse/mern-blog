import callApi from "../util/apiCaller";

// Export Constants
export const ADD_POST = "ADD_POST";
export const ADD_POSTS = "ADD_POSTS";
export const DELETE_POST = "DELETE_POST";
export const REFRESH_POSTS = "REFRESH_POSTS";

// Export Actions
export function addPost(post) {
  return {
    type: ADD_POST,
    post
  };
}

export function refreshPosts() {
  return {
    type: REFRESH_POSTS
  };
}

export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    posts
  };
}

export function deletePost(cuid) {
  return {
    type: DELETE_POST,
    cuid
  };
}
