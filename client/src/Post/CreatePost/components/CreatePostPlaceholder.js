import React, { useContext, useState, useEffect } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import Box from "UI/Box/Box";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "24px",
    border: "1px solid lightgray",
    cursor: "pointer",
    "&:hover": {
      border: "1px solid gray"
    }
  }
}));
const CreatePostPlaceholder = ({ onClick }) => {
  const classes = useStyles();

  return (
    <Box
      px={2}
      py={1}
      flex
      alignCenter
      className={classes.root}
      onClick={onClick}
    >
      <EditIcon htmlColor="gray" /> create a new post
    </Box>
  );
};

CreatePostPlaceholder.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default CreatePostPlaceholder;
