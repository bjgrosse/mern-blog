import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "util/useErrorHandler";
import cuid from "cuid";
import { useSnackbar } from "notistack";

import Box from "UI/Box/Box";
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ImageIcon from "@material-ui/icons/Image";
import CollapseIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";

import SignInDialog from "Auth/components/SignInDialog";
import UploadButton from "UI/UploadButton/UploadButton";
import LoadingButton from "UI/LoadingButton/LoadingButton";
import HR from "UI/HR/HR";

import CreatePostPlaceholder from "Post/CreatePost/components/CreatePostPlaceholder";
import AttachImagesWidget from "Post/AttachedImages/components/AttachedImagesWidget";
import { uploadImages } from "Post/ImageUploadService";
import useDataLoader from "util/useDataLoader";
import { addPost } from "Post/PostService";

import {
  updateField,
  addImages,
  updateImage,
  deleteImage,
  clearDraft
} from "../CreatePostActions";

// Import Style
const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(2)
    }
  },
  header: {
    flexGrow: 1
  },
  alert: {
    marginTop: theme.spacing(1),
    borderRadius: theme.spacing(1)
  },
  contentInput: {
    transition: "max-height .3s ease-in-out",
    maxHeight: props => (props.isExpanded ? "unset" : "20px")
  }
}));

const acceptedTypes = ["image/png", "image/jpeg", "image/gif"];

const CreatePostWidget = ({ expanded }) => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [showSignIn, setShowSignIn] = useState();
  const [loadData, isLoading, errors, clearErrors] = useDataLoader();
  const state = useSelector(state => state.draft);
  const classes = useStyles({ isExpanded });
  const { enqueueSnackbar } = useSnackbar();
  const handleUploadError = useErrorHandler("Upload failed");

  // if our expanded prop changed then our
  // parent wants us to expand
  useEffect(() => {
    if (expanded) {
      setIsExpanded(true);
    }
  }, [expanded]);
  const submit = () => {
    clearErrors();

    loadData(addPost(state, dispatch), () => {
      enqueueSnackbar("New post published!", {
        variant: "success"
      });

      handleClear();
      setIsExpanded(false);
    });
  };

  const handlePost = () => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }
    submit();
  };

  const handleClear = () => {
    dispatch(clearDraft());
  };

  const handleCancelSignin = () => {
    setShowSignIn(false);
  };

  const handleLoggedIn = () => {
    setShowSignIn(false);
    submit();
  };

  const handleChange = evt => {
    dispatch(updateField(evt.target.name, evt.target.value));
  };

  // Triggered when the user selects one or more images for upload
  const handleFiles = e => {
    let files = Array.from(e.target.files);
    files = files.filter(x => acceptedTypes.includes(x.type));

    const newImages = files.map(x => ({
      cuid: cuid(),
      file: x,
      isPending: true,
      caption: ""
    }));

    // add the images to state
    dispatch(addImages(newImages));

    // start uploading
    uploadImages(newImages, handleUpdateImage, handleUploadError);
  };

  const handleRetry = image => {
    uploadImages([image], handleUpdateImage, handleUploadError);
  };
  const handleUpdateImage = (image, changes) => {
    dispatch(updateImage(image.cuid, changes));
  };
  const handleDeleteImage = image => {
    dispatch(deleteImage(image.cuid));
  };
  const handleToggleExpanded = () => {
    setIsExpanded(value => !value);
  };

  const uploading = state.images.filter(x => x.isPending && !x.failed).length;
  const failed = state.images.filter(x => x.failed).length;

  return (
    <div className={`d-flex flex-column w-100 mt-3`}>
      <Collapse in={!isExpanded}>
        <CreatePostPlaceholder onClick={handleToggleExpanded} />
      </Collapse>
      <Collapse in={isExpanded}>
        <Box className={classes.root}>
          <Box flexCenter onClick={handleToggleExpanded}>
            <h4 className={classes.header}>Create new post</h4>
            <IconButton size="medium" color="primary">
              <CollapseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            autoFocus
            variant="outlined"
            label="title"
            name="title"
            error={errors.title}
            helperText={errors.title}
            value={state.title}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            multiline
            fullWidth
            rows={8}
            label="content"
            error={errors.content}
            helperText={errors.content}
            name="content"
            value={state.content}
            onChange={handleChange}
            inputProps={{
              className: classes.contentInput
            }}
          />
        </Box>
        <Collapse in={state.images.length > 0}>
          <AttachImagesWidget
            canEdit={true}
            acceptedFileTypes={acceptedTypes}
            onFilesSelected={handleFiles}
            onRetry={handleRetry}
            onUpdate={handleUpdateImage}
            onDelete={handleDeleteImage}
            images={state.images}
          />
          <Box mb={2} />
        </Collapse>
        <Box flex alignCenter>
          <UploadButton
            accept={acceptedTypes.join(",")}
            multiple
            color="primary"
            variant="outlined"
            startIcon={<ImageIcon />}
            onChange={handleFiles}
          >
            add images
          </UploadButton>
          <Box grow></Box>
          <Box>
            <Button color="primary" onClick={handleClear}>
              clear
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={handlePost}
              isLoading={isLoading}
              disabled={!state.title || !state.content || uploading || failed}
            >
              Post
            </LoadingButton>
          </Box>
        </Box>
        <Collapse in={uploading > 0}>
          <Alert className={classes.alert} severity="info">{`${Math.max(
            1,
            uploading
          )} image${uploading > 1 ? "s are" : " is"} uploading...`}</Alert>
        </Collapse>
        <Collapse in={failed > 0}>
          <Alert className={classes.alert} severity="error">{`${failed} image${
            failed > 1 ? "s" : ""
          } failed to upload. Please remove ${
            failed > 1 ? "them" : "it"
          }.`}</Alert>
        </Collapse>
        <HR mt={2} mx={-2} />
      </Collapse>
      <SignInDialog
        message="Sign in now to publish your post!"
        isOpen={showSignIn}
        onCancel={handleCancelSignin}
        onLoggedIn={handleLoggedIn}
        noAlerts
      />
    </div>
  );
};

CreatePostWidget.propTypes = {
  /** tells the widget to switch to expanded state */
  expanded: PropTypes.bool
};

export default CreatePostWidget;
