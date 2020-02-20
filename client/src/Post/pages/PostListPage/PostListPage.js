import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "UI/Box/Box";

import useDataLoader from "util/useDataLoader";

// Import Components
import PostList from "Post/components/PostList";
import CreatePostWidget from "Post/CreatePost/components/CreatePostWidget";
// Import Actions
import { deletePost, fetchPosts } from "Post/PostService";

const PostListPage = ({ showAddPost }) => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.data);
  const [expandCreatePost, setExpandCreatePost] = useState();
  const [loadData, isLoading] = useDataLoader();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadData(fetchPosts(dispatch)).then(posts => {
      if (posts.length === 0) {
        setExpandCreatePost(true);
      }
    });
  }, []);

  const handleDeletePost = post => {
    if (window.confirm("Do you want to delete this post")) {
      // eslint-disable-line
      deletePost(post, dispatch).then(() => {
        enqueueSnackbar("Post deleted", {
          variant: "success"
        });
      });
    }
  };

  return (
    <Box fullWidth>
      <CreatePostWidget showAddPost={showAddPost} expanded={expandCreatePost} />
      <Collapse in={!isLoading} timeout={1000}>
        <PostList handleDeletePost={handleDeletePost} posts={posts} />
      </Collapse>

      <Collapse in={isLoading}>
        <Box fullWidth mt={5} flexCenter column>
          <CircularProgress />
        </Box>
      </Collapse>
    </Box>
  );
};

PostListPage.propTypes = {
  showAddPost: PropTypes.bool.isRequired
};

export default PostListPage;
