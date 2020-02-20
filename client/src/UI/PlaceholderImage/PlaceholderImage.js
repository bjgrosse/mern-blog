import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import placeholder from "./placeholder.svg";

const useStyles = makeStyles(theme => ({
  placeholder: {
    width: props => props.width,
    height: props => props.height
  },
  animate: {
    animation: `$loadingFade 1000ms alternate infinite ease-in-out`
  },

  suppliedStyle: props => props.style,
  "@keyframes loadingFade": {
    "0%": {
      opacity: 0.2
    },
    "100%": {
      opacity: 1
    }
  }
}));

const PlaceholderImage = ({
  style,
  width,
  height,
  animate = true,
  ...props
}) => {
  const classes = useStyles({ style, width, height, animate });

  return (
    <img
      src={placeholder}
      alt="loading"
      className={`${classes.placeholder} ${classes.suppliedStyle} ${
        animate ? classes.animate : null
      }`}
      {...props}
    />
  );
};
export default PlaceholderImage;
