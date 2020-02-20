import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Collapse from "@material-ui/core/Collapse";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";

import UploadButton from "UI/UploadButton/UploadButton";
import TileGallery from "UI/TileGallery/TileGallery";
import useBreakpoints from "UI/useBreakpoints/useBreakpoints";

import FullscreenGalleryWidget from "Post/FullscreenGallery/components/FullscreenGalleryWidget";
import AttachedImageThumbnail from "Post/AttachedImages/components/AttachedImageThumbnail";

const useStyles = makeStyles(theme => ({
  galleryContainer: {
    overflow: "hidden",
    display: "flex",
    background: "#eee",
    borderRadius: theme.spacing(1),
    border: "1px solid lightgray",
    padding: theme.spacing(0.5)
  },
  addTile: {
    margin: "4px",
    border: "2px dashed gray",
    borderRadius: "16px",
    height: "100%",
    marginLeft: theme.spacing(1)
  }
}));

/** Displays a list of images in a thumnail style gallery.
 *  If canEdit = true, then the user can upload new images,
 *  edit captions, and delete images. Changes the image list and
 *  images are passed up to the parent via the onAdd/onUpdate/onDelete
 *  functional props
 */
const AttachedImagesWidget = ({
  images,
  canEdit,
  onRetry,
  onUpdate,
  onDelete,
  wrapImages
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageCuid, setSelectedImageCuid] = useState();
  const classes = useStyles();

  // if we're allowed to wrap images onto multiple lines,
  // then use % sizing, otherwise use fixed sizing
  const tileSize = useBreakpoints(
    wrapImages ? ["50%", "50%", "33.3%"] : ["100px", "150px", "200px"]
  );

  const handleUpdateImage = (image, changes) => {
    onUpdate(image, changes);
  };
  const handleClickImage = image => {
    setSelectedImageCuid(image.cuid);
    setIsGalleryOpen(true);
  };
  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const selectedImage = images.filter(x => x.cuid === selectedImageCuid)[0];
  return (
    <div>
      <>
        <div className={classes.galleryContainer}>
          <TileGallery
            keyField="cuid"
            tiles={images}
            wrap={wrapImages}
            renderItem={image => (
              <AttachedImageThumbnail
                width={tileSize}
                key={image.cuid}
                image={image}
                canEdit={canEdit}
                onDelete={onDelete}
                onRetry={onRetry}
                onClick={handleClickImage}
                scrollTo={image == selectedImage}
              />
            )}
          />
        </div>
        {selectedImage && (
          <FullscreenGalleryWidget
            isOpen={isGalleryOpen}
            onClose={handleCloseGallery}
            images={images}
            canEdit={canEdit}
            image={selectedImage}
            onRetry={onRetry}
            onSelectImage={handleClickImage}
            onUpdateImage={handleUpdateImage}
            onDelete={onDelete}
          />
        )}
      </>
    </div>
  );
};

AttachedImagesWidget.propTypes = {
  /** the array of image objects to be displayed */
  images: PropTypes.array.isRequired,
  /** whether or not the user can add/edit/delete images */
  canEdit: PropTypes.bool,
  /** called when the user adds new images */
  onAdd: PropTypes.func,
  /** called when the user updates an image (such as editing the caption) */
  onUpdate: PropTypes.func,
  /** called when the user deletes an image */
  onDelete: PropTypes.func
};

export default AttachedImagesWidget;
