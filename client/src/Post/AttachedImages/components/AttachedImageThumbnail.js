import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import scrollIntoView from "scroll-into-view";
import Fade from "@material-ui/core/Fade";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import RefreshIcon from "@material-ui/icons/Refresh";
import Box from "UI/Box/Box";
import PlaceholderImage from "UI/PlaceholderImage/PlaceholderImage";
import { getImageUrl } from "Post/ImageUploadService";

const bottomBarStyle = theme => ({
  height: "unset",
  "& > *": {
    margin: 0
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    paddingTop: "0px",
    paddingBottom: "0px"
  },
  [theme.breakpoints.up("sm")]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5)
  }
});
const useStyles = makeStyles(theme => ({
  tile: {
    position: "relative",
    cursor: "pointer",
    flexBasis: props => props.width,
    paddingBottom: props => props.width,
    flexShrink: 0,
    "&:hover $deleteBar": {
      opacity: 1
    },
    "&:hover $editBar": {
      opacity: 1
    }
  },
  container: {
    overflow: "hidden",
    boxShadow: theme.shadows[1],
    border: "1px solid rgba(0,0,0,0.3)",
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    background: "white"
  },
  title: {
    color: "white"
  },
  titleBar: {
    background: "rgba(0,0,0,0.5)",
    ...bottomBarStyle(theme)
  },
  editBar: {
    color: "white",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
    opacity: 0,
    transition: "opacity .2s ease-in-out",
    ...bottomBarStyle(theme)
  },
  deleteBar: {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
    opacity: 0,
    transition: "opacity .2s ease-in-out"
  },
  delete: {
    background: "rgba(0, 0, 0, 0.2)",
    marginTop: "-4px",
    marginRight: "-4px",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.3)"
    }
  },
  failed: {
    color: "red",
    fontWeight: theme.typography.fontWeightBold
  }
}));

/** Displays the specified image as a thumbnail. */
const AttachedImageThumbnail = ({
  onClick,
  image,
  canEdit,
  onDelete,
  onRetry,
  width = "200px",
  height = "200px",
  scrollTo
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState();
  const classes = useStyles({ width, height });
  const ref = useRef();

  const imgSrc = getImageUrl(image.cuid, "h_200,w_200,c_fill");

  useEffect(() => {
    if (image.failed || scrollTo) {
      console.log("scroll to");
      // scroll into view, but only scroll the first scrollable parent: don't
      // scroll the whole window
      scrollIntoView(ref.current, {
        validTarget: (target, parentsScrolled) => parentsScrolled <= 1
      });
    }
  }, [image, scrollTo]);
  const handleClick = () => {
    onClick(image);
  };

  const handleLoaded = () => {
    setIsImageLoaded(true);
  };

  const handleDelete = e => {
    onDelete(image);
    e.stopPropagation();
  };

  const handleRetry = e => {
    onRetry(image);
    e.stopPropagation();
  };

  return (
    <Box ref={ref} className={classes.tile} onClick={handleClick}>
      <Box absolute full className={classes.container}>
        <Fade in={!isImageLoaded}>
          <Box absolute full>
            <PlaceholderImage animate={!image.failed} />
            {image.failed && (
              <Box absolute full flexCenter column>
                <div className={classes.failed}>Upload failed</div>
                <Button onClick={handleRetry} startIcon={<RefreshIcon />}>
                  retry
                </Button>
              </Box>
            )}
          </Box>
        </Fade>
        {!image.isPending && (
          <Fade in={isImageLoaded}>
            <img
              src={imgSrc}
              height="100%"
              onLoad={handleLoaded}
              alt={image.caption}
            />
          </Fade>
        )}

        {canEdit && (
          <GridListTileBar
            titlePosition="top"
            classes={{
              root: classes.deleteBar
            }}
            actionIcon={
              <IconButton
                aria-label={`remove ${image.caption || "image"}`}
                onClick={handleDelete}
                className={classes.delete}
              >
                <DeleteIcon htmlColor="white" />
              </IconButton>
            }
          />
        )}
        <Fade in={image.caption}>
          <GridListTileBar
            title={image.caption ? image.caption : "add caption"}
            classes={{
              root: classes.titleBar,
              title: classes.title
            }}
          />
        </Fade>
        {!image.caption && canEdit && (
          <GridListTileBar
            title="add caption"
            classes={{
              root: classes.editBar
            }}
            actionPosition="left"
            actionIcon={<EditIcon htmlColor="white" />}
          />
        )}
      </Box>
    </Box>
  );
};

AttachedImageThumbnail.propTypes = {
  /** the image object to display */
  image: PropTypes.object.isRequired,
  /** called when the image is clicked */
  onClick: PropTypes.func,
  /** should we show edit/delete controls? */
  canEdit: PropTypes.bool,
  /** called when the user clicks the delete button */
  onDelete: PropTypes.func,
  /** specifies the desired width of the thumbnail. Accepts any CSS-compatible value */
  width: PropTypes.string,
  /** specifies the desired width of the thumbnail. Accepts any CSS-compatible value */
  height: PropTypes.string
};

AttachedImageThumbnail.defaultProps = {
  width: "200px",
  height: "200px"
};
export default AttachedImageThumbnail;
