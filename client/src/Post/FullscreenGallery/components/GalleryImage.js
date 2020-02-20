import React, { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";
import { Swipeable } from "react-touch";
import { makeStyles } from "@material-ui/core/styles";

import RefreshIcon from "@material-ui/icons/Refresh";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import PlaceholderImage from "UI/PlaceholderImage/PlaceholderImage";

import { getImageUrl } from "Post/ImageUploadService";

import Box from "UI/Box/Box";

const useStyles = makeStyles(theme => ({
  imageContainer: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: theme.spacing(1),
    boxShadow: "black 0px 0px 50px -20px"
  },
  image: {
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
    width: props => (props.imageLoaded ? "auto" : 0),
    height: props => (props.imageLoaded ? "auto" : 0),
    background: "white",
    margin: "auto",
    pointerEvents: "auto",
    borderRadius: theme.spacing(1)
  },
  failed: {
    position: "absolute",
    margin: "auto",
    color: "red",
    fontWeight: theme.typography.fontWeightBold,
    pointerEvents: "auto"
  }
}));

/** Displays the specified image. Displays a placeholder
 * image while the final image is downloadeing.
 * Displays a failure notice if the image failed to upload,
 * and allows the user to retry
 */
const GalleryImage = ({
  image,
  onDelete,
  onRetry,
  onMovePrevious,
  onMoveNext
}) => {
  const [imageLoadingDelayed, setImageLoadingDelayed] = useState();
  const [imageLoaded, setImageLoaded] = useState();
  const imgRef = useRef();
  const classes = useStyles({ imageLoaded });

  // the image just changed, so reset the image loaded flags
  useEffect(() => {
    setImageLoadingDelayed(false);
    setImageLoaded(false);
  }, [image]);

  // when the imageLoaded state has finished setting as false
  // start a timer for 300ms. If the image still hasn't loaded
  // at tha time, then set the imageLoadingDelayed flag so we
  // can show our placeholder image.
  useEffect(() => {
    if (!imageLoaded) {
      setTimeout(() => {
        console.log(imageLoaded);
        setImageLoadingDelayed(!imageLoaded);
      }, 300);
    }
  }, [imageLoaded]);

  const handleRetry = () => {
    onRetry(image);
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  // Show the placeholder if the image failed to upload, is still uploading,
  // or the image hasn't loaded after waiting longer than 300ms
  const showPlaceholder =
    image.failed || image.isPending || (!imageLoaded && imageLoadingDelayed);

  return (
    <Box relative className={classes.imageContainer}>
      {showPlaceholder && (
        <PlaceholderImage
          height="50vh"
          width="50vh"
          style={{
            margin: "auto",
            height: "50vh",
            borderRadius: "32px"
          }}
          animate={!image.failed}
        />
      )}
      {image.failed && (
        <Box absolute center flexCenter column className={classes.failed}>
          <div>Upload failed</div>
          <Button onClick={handleRetry} startIcon={<RefreshIcon />}>
            retry
          </Button>
        </Box>
      )}
      {!image.isPending && (
        <Fade in={imageLoaded} key={image.cuid}>
          <Swipeable onSwipeLeft={onMoveNext} onSwipeRight={onMovePrevious}>
            <img
              ref={imgRef}
              src={getImageUrl(image.cuid)}
              alt={image.caption}
              className={classes.image}
              onLoad={handleImageLoaded}
            />
          </Swipeable>
        </Fade>
      )}
    </Box>
  );
};

GalleryImage.propTypes = {
  /** the image object to display */
  image: PropTypes.object.isRequired,
  /** called if the user clicks Retry on a failed image */
  onRetry: PropTypes.func,
  /** called when the user swipes on the image to move to the previous */
  onMovePrevious: PropTypes.func,
  /** called when the user swipes on the image to move to the previous */
  onMoveNext: PropTypes.func
};

export default GalleryImage;
