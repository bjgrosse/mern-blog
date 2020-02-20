import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

// Import Components
import PostListItem from "./PostListItem";

function PostList(props) {
  const currentUserId = useSelector(state =>
    state.auth.user ? state.auth.user.cuid : null
  );
  return (
    <div className="d-flex flex-column w-100 mt-4">
      {props.posts.map(post => (
        <PostListItem
          post={post}
          key={post.cuid}
          onDelete={() => props.handleDeletePost(post.cuid)}
          canDelete={post.authorCuid === currentUserId}
        />
      ))}
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      cuid: PropTypes.string.isRequired
    })
  ).isRequired,
  handleDeletePost: PropTypes.func.isRequired
};

export default PostList;
