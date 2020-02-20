import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import LeftIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import RightIcon from "@material-ui/icons/KeyboardArrowRightRounded";
import Box from "UI/Box/Box";

const iconButtonStyle = theme => ({
  background: "rgba(0,0,0,.2)",
  color: "white",
  pointerEvents: "auto",
  [theme.breakpoints.down("sm")]: {
    height: "32px",
    width: "32px",
    padding: theme.spacing(0.5)
  },
  [theme.breakpoints.up("sm")]: {
    height: "48px",
    width: "48px",
    padding: theme.spacing(1),
    fontSize: "2rem"
  },
  "&:hover": {
    background: "rgba(0,0,0,.3)"
  }
});

const arrowButtonStyle = theme => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  margin: "auto",
  ...iconButtonStyle(theme)
});
const useStyles = makeStyles(theme => ({
  leftBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "auto",
    width: "64px"
  },
  rightBar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "auto",
    width: "64px"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    ...iconButtonStyle(theme)
  },
  leftArrow: {
    left: theme.spacing(1),
    ...arrowButtonStyle(theme)
  },
  rightArrow: {
    right: theme.spacing(1),
    ...arrowButtonStyle(theme)
  }
}));

/** Displays the previous/next navigation buttons */
const GalleryNavigationButtons = ({ onMoveNext, onMovePrevious }) => {
  const classes = useStyles();
  return (
    <>
      <Box className={classes.leftBar} onClick={onMovePrevious}>
        <IconButton className={classes.leftArrow}>
          <LeftIcon />
        </IconButton>
      </Box>
      <Box className={classes.rightBar} onClick={onMoveNext}>
        <IconButton className={classes.rightArrow}>
          <RightIcon />
        </IconButton>
      </Box>
    </>
  );
};

GalleryNavigationButtons.propTypes = {
  onMoveNext: PropTypes.func,
  onMovePrevious: PropTypes.func
};

export default GalleryNavigationButtons;
