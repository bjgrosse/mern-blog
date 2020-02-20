import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import CheckIcon from "@material-ui/icons/CheckCircle";
import EditIcon from "@material-ui/icons/Edit";
import Box from "UI/Box/Box";

const KEY_ESC = 27;

const scrollBarStyle = {
  "& > *::-webkit-scrollbar": {
    width: "8px",
    height: "8px"
  },
  "& > *::-webkit-scrollbar-thumb": {
    background: "rgb(255, 255, 255, 0.2)",
    borderRadius: "100px"
  },
  "& > *::-webkit-scrollbar-thumb:hover": {
    background: "#333333"
  }
};
const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: "94px",
    color: "white",
    background: "rgba(0,0,0,.5)",
    width: "100%",
    borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px 0px`,
    overflow: "hidden",
    pointerEvents: "auto",
    "& pre": {
      whiteSpace: "pre-wrap",
      color: "inherit",
      fontFamily: "inherit"
    },
    ...scrollBarStyle
  },
  captionField: {
    borderRadius: `${theme.spacing(1)}px ${theme.spacing(1)}px 0px 0px`,
    width: "100%",
    pointerEvents: "auto",
    background: "rgba(156, 156, 156, 0.3)"
  },
  captionInput: {
    color: "white",
    ...scrollBarStyle
  },
  captionScrollbox: {
    alignSelf: "stretch"
  },
  checkButton: {
    background: "rgba(0,0,0,.2)",

    "&:hover": {
      background: "rgba(0,0,0,.3)"
    }
  }
}));

/** Shows the caption, and if canEdit, allows the user
 * to edit the caption
 */
const GalleryCaptionWidget = ({ canEdit, caption, onChange }) => {
  const classes = useStyles();
  const [inEditMode, setInEditMode] = useState(canEdit);

  // need to stopPropagation on keyDown events in the caption input box
  // so that left/right arrow keys don't propagate up and trigger moving
  // to prev/next image
  const handleCaptionKeyDown = e => {
    if (e.keyCode !== KEY_ESC) {
      e.stopPropagation();
    }
  };

  const handleToggleEditMode = () => {
    setInEditMode(mode => !mode);
  };

  useEffect(() => {
    if (!caption && canEdit) {
      setInEditMode(true);
    }
  }, [caption]);

  return (
    <Container maxWidth="md">
      <Collapse in={inEditMode}>
        <Input
          autoFocus={true}
          className={classes.captionField}
          InputProps={{
            className: classes.captionInput,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="medium"
                  className={classes.checkButton}
                  onClick={handleToggleEditMode}
                >
                  <CheckIcon fontSize="large" htmlColor="#00ff00" />
                </IconButton>
              </InputAdornment>
            )
          }}
          multiline
          value={caption}
          rows={3}
          placeholder="add a caption"
          onChange={onChange}
          onKeyDown={handleCaptionKeyDown}
          variant="outlined"
        />
      </Collapse>

      <Collapse in={!inEditMode}>
        <Box flex alignStart className={classes.root}>
          <Box m={[0.5, 1]} scrollY grow className={classes.captionScrollbox}>
            <pre>{caption}</pre>
          </Box>
          {canEdit && (
            <IconButton onClick={handleToggleEditMode}>
              <EditIcon fontSize="small" htmlColor="white" />
            </IconButton>
          )}
        </Box>
      </Collapse>
    </Container>
  );
};

GalleryCaptionWidget.propTypes = {
  /** if the user can edit the caption */
  canEdit: PropTypes.bool,
  /** the caption to display */
  caption: PropTypes.string,
  /** called when the caption is edited */
  onChange: PropTypes.func
};
export default GalleryCaptionWidget;
