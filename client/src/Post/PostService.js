import callApi from "../util/apiCaller";
import * as PostActions from "./PostActions";

export function addPost(post, dispatch) {
  return callApi("posts", "post", {
    post: {
      name: post.name,
      title: post.title,
      content: post.content,
      images: post.images.map(x => ({
        cuid: x.cuid,
        caption: x.caption
      }))
    }
  }).then(res => dispatch(PostActions.addPost(res.post)));
}

export function refreshPosts(dispatch) {
  dispatch(PostActions.refreshPosts());

  return fetchPosts(dispatch);
}

export function fetchPosts(dispatch) {
  return callApi("posts").then(res => {
    dispatch(PostActions.addPosts(res.posts));
    return res.posts;
  });
}

export function fetchPost(cuid, dispatch) {
  return callApi(`posts/${cuid}`).then(res => {
    dispatch(PostActions.addPost(res.post));
    return res.post;
  });
}
export function deletePost(cuid, dispatch) {
  return callApi(`posts/${cuid}`, "delete").then(() =>
    dispatch(PostActions.deletePost(cuid))
  );
}
