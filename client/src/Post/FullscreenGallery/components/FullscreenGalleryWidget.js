import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Grow from "@material-ui/core/Grow";

import GalleryNavigationButtons from "./GalleryNavigationButtons";
import GalleryImage from "./GalleryImage";
import GallerTopBar from "./GalleryTopBar";
import GalleryCaptionWidget from "./GalleryCaptionWidget";
import Box from "UI/Box/Box";
import { getImageUrl } from "Post/ImageUploadService";

const KEY_RIGHT = 39;
const KEY_LEFT = 37;
const KEY_ESC = 27;

const useStyles = makeStyles(theme => ({
  container: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    pointerEvents: "none"
  },
  imageContainerRow: {
    overflow: "hidden",
    maxWidth: "100%",
    maxHeight: "100%"
  },
  failed: {
    position: "absolute",
    margin: "auto",
    color: "red",
    fontWeight: theme.typography.fontWeightBold,
    pointerEvents: "auto"
  },
  backdrop: { backgroundColor: "rgba(0, 0, 0, 0.85) !important" }
}));

/** displays the list of image objects in a full-screen gallery view */
const FullscreenGalleryWidget = ({
  isOpen,
  images,
  image,
  onClose,
  canEdit,
  onSelectImage,
  onUpdateImage,
  onRetry,
  onDelete
}) => {
  const [caption, setCaption] = useState(image.caption);
  const [prevImage, setPrevImage] = useState();
  const [nextImage, setNextImage] = useState();
  const classes = useStyles();

  // When the active image changes, prefetch the previous and next images
  // so the browser cache has them on hand if the user moves to them
  useEffect(() => {
    // Load this image's caption into local state
    setCaption(image.caption);

    if (images.length === 1) {
      setPrevImage(null);
      setNextImage(null);
      return;
    }

    let idx = images.indexOf(image);

    function loadImage(img, setter) {
      // don't try to load the image if it's still uploading
      if (!img.isPending) {
        new Image().src = getImageUrl(img.cuid);
      }
      setter(img);
    }

    // Load and set the prevImage
    if (idx > 0) {
      loadImage(images[idx - 1], setPrevImage);
    } else {
      loadImage(images[images.length - 1], setPrevImage);
    }

    // Load and set the nextImage
    if (idx < images.length - 1) {
      loadImage(images[idx + 1], setNextImage);
    } else {
      loadImage(images[0], setNextImage);
    }
  }, [image]);

  const handleMovePrevious = () => {
    if (!prevImage) return;
    saveChanges();
    onSelectImage(prevImage);
  };
  const handleMoveNext = () => {
    if (!nextImage) return;
    saveChanges();
    onSelectImage(nextImage);
  };

  const handleDelete = () => {
    let imageToDelete = image;

    // Go ahead and move to the next/previous image
    if (nextImage) {
      handleMoveNext();
    } else if (prevImage) {
      handleMovePrevious();

      // Or close if this is the last image in the list
    } else {
      handleClose();
    }

    // And now trigger the delete
    onDelete(imageToDelete);
  };

  const handleCaptionChange = e => {
    setCaption(e.target.value);
  };

  const handleClose = () => {
    saveChanges();
    onClose();
  };

  const saveChanges = () => {
    if (caption !== image.caption) {
      onUpdateImage(image, { caption: caption });
    }
  };

  const handleKeyDown = e => {
    if (e.keyCode === KEY_RIGHT) {
      handleMoveNext();
    } else if (e.keyCode === KEY_LEFT) {
      handleMovePrevious();
    } else if (e.keyCode === KEY_ESC) {
      handleClose();
    }
  };

  return (
    <Modal
      BackdropProps={{ className: classes.backdrop }}
      open={isOpen}
      closeAfterTransition
      onClose={handleClose}
      onKeyDown={handleKeyDown}
    >
      <Grow in={isOpen}>
        <Box className={classes.container} flexCenter column>
          <GallerTopBar
            onClose={handleClose}
            onDelete={handleDelete}
            canEdit={canEdit}
          />
          <Box
            grow
            flexCenter
            column
            fullWidth
            relative
            p={[0, 1, 2, 4]}
            className={classes.imageContainerRow}
          >
            <GalleryImage
              image={image}
              onRetry={onRetry}
              onDelete={handleDelete}
              canEdit={canEdit}
              onMovePrevious={handleMovePrevious}
              onMoveNext={handleMoveNext}
            />
          </Box>
          {!image.isPending && (image.caption || canEdit) && (
            <Grow in={isOpen}>
              <GalleryCaptionWidget
                caption={caption}
                onChange={handleCaptionChange}
                canEdit={canEdit}
              />
            </Grow>
          )}
          {images.length > 1 && (
            <GalleryNavigationButtons
              onMoveNext={handleMoveNext}
              onMovePrevious={handleMovePrevious}
            />
          )}
        </Box>
      </Grow>
    </Modal>
  );
};

FullscreenGalleryWidget.propTypes = {
  /** controls whether the view is displayed */
  isOpen: PropTypes.bool,
  /** the array of image objects to display */
  images: PropTypes.array,
  /** the currently selected image */
  image: PropTypes.object,
  /** called on close */
  onClose: PropTypes.func,
  /** allow the user to edit/delete the image */
  canEdit: PropTypes.bool,
  /** caleld when the user selects a different image */
  onSelectImage: PropTypes.func,
  /** called when a property of the image needs updated (such as caption) */
  onUpdateImage: PropTypes.func,
  /** called when the user clicks Retry on a failed upload */
  onRetry: PropTypes.func,
  /** called when the user clicks Delete on an image */
  onDelete: PropTypes.func
};
export default FullscreenGalleryWidget;
