import React, { useContext, useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Button as MuiButton } from "@material-ui/core";
const useStyles = makeStyles(theme => ({
  bold: {
    fontWeight: theme.typography.fontWeightBold
  }
}));

const Button = ({ isDefault, ...props }) => {
  const classes = useStyles();
  return <MuiButton {...props} className={isDefault ? classes.bold : null} />;
};
export default Button;
