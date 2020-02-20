import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { makeStyles } from "@material-ui/core/styles";
import useBreakpoints from "UI/useBreakpoints/useBreakpoints";

import Box from "UI/Box/Box";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    background:
      "linear-gradient(to bottom,rgba(0,0,0,0.65) 0%,transparent 100%)",
    color: "white",
    pointerEvents: "auto",
    padding: theme.spacing(0.5)
  },
  button: {
    color: "white"
  },
  deleteButton: {
    color: "red"
  }
}));

/** displays the top nav bar for the fullscreen gallery */
const GalleryTopBar = ({ onClose, onDelete, canEdit }) => {
  const buttonSize = useBreakpoints(["small", "medium"], ["xs", "md"]);
  const classes = useStyles();
  return (
    <Box zIndex={100} flex alignCenter justifyBetween className={classes.root}>
      <Box />

      {canEdit && (
        <Button
          size={buttonSize}
          onClick={onDelete}
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      )}

      <IconButton
        size={buttonSize}
        onClick={onClose}
        className={classes.button}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

GalleryTopBar.propTypes = {
  /** called when the user clicks the close button */
  onClose: PropTypes.func,
  /** called when the user clicks the delete button */
  onDelete: PropTypes.func,
  /** controls whether the user can make changes (such as delete) */
  canEdit: PropTypes.bool
};

export default GalleryTopBar;
