import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "UI/Box/Box";
import useDataLoader from "util/useDataLoader";
import HR from "UI/HR/HR";
import AttachedImagesWidget from "Post/AttachedImages/components/AttachedImagesWidget";

// Import Actions
import { fetchPost } from "Post/PostService";
// Import Selectors
import { useParams } from "react-router-dom";

export function PostDetailPage() {
  const { cuid } = useParams();
  const post = useSelector(state =>
    state.posts.data.find(currentPost => currentPost.cuid === cuid)
  );
  const dispatch = useDispatch();

  const [loadData, isLoading] = useDataLoader();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!post) loadData(fetchPost(cuid, dispatch));
  }, []);

  return (
    <div className="container">
      <Collapse in={isLoading}>
        <Box fullWidth mt={5} flexCenter column>
          <CircularProgress />
        </Box>
      </Collapse>

      <Collapse in={!isLoading}>
        {post && (
          <div className="row">
            <div className="col-12 mt-4">
              <h1>{post.title}</h1>
              <p>By {post.name}</p>
              <HR />
              <p className="my-4">
                <pre>{post.content}</pre>
              </p>
              {post.images.length > 0 && (
                <AttachedImagesWidget images={post.images} wrapImages />
              )}
            </div>
          </div>
        )}
      </Collapse>
    </div>
  );
}
export default PostDetailPage;
