import { combineReducers, createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import posts from "Post/PostReducer";
import draft from "Post/CreatePost/CreatePostReducer";
import auth from "Auth/AuthReducer";

// Middleware and store enhancers
const enhancers = [applyMiddleware(thunk)];

const store = createStore(
  combineReducers({ posts, auth, draft }),
  {},
  compose(...enhancers)
);

export default store;
