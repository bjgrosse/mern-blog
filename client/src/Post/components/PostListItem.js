import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card } from "@material-ui/core";
import TruncateMarkup from "react-truncate-markup";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { makeStyles } from "@material-ui/core/styles";

import AttachImagesWidget from "Post/AttachedImages/components/AttachedImagesWidget";
const useStyles = makeStyles(theme => ({
  card: {
    background: "linear-gradient(to bottom, #efefef, white)",
    marginBottom: theme.spacing(2),
    border: "1px rgba(0,0,0,.1) solid",
    boxShadow: "0px 2px 5px -4px black"
  }
}));

function PostListItem({ post, onDelete, canDelete }) {
  const classes = useStyles();
  const [visibleLines, setVisibleLines] = useState(5);
  const handleShowMore = e => {
    setVisibleLines(lines => lines * 3);
    e.preventDefault();
  };
  return (
    <Card className={classes.card}>
      <CardHeader
        title={
          <Typography gutterBottom variant="h5" component="h2">
            <Link to={`/posts/${post.cuid}/${post.slug}`}>{post.title}</Link>
          </Typography>
        }
        subheader={`by ${post.name}`}
        action={
          canDelete && (
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        <TruncateMarkup
          lines={visibleLines}
          ellipsis={
            <span>
              ...{" "}
              <a href="#" onClick={handleShowMore}>
                read more
              </a>
            </span>
          }
        >
          <Typography component="p" className="mb-3">
            <pre>{post.content}</pre>
          </Typography>
        </TruncateMarkup>
        {post.images.length > 0 && <AttachImagesWidget images={post.images} />}
      </CardContent>
    </Card>
  );
}

PostListItem.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default PostListItem;
