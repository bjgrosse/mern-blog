import React, { useContext, useState, useEffect } from "react";
import Button from "../Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
const LoadingButton = ({
  isLoading,
  children,
  disabled,
  indicatorSize = 24,
  indicatorColor,
  ...props
}) => {
  return (
    <Button {...props} disabled={isLoading || disabled}>
      {isLoading ? (
        <CircularProgress
          size={indicatorSize}
          color={indicatorColor || props.color}
        />
      ) : (
        children
      )}
    </Button>
  );
};
export default LoadingButton;
