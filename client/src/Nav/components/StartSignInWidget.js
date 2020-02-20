import React, { useContext, useState, useEffect, useRef } from "react";

import Input from "@material-ui/core/FilledInput";
import IconButton from "@material-ui/core/IconButton";
import RightIcon from "@material-ui/icons/PlayCircleFilled";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";

import SignInDialog from "../../Auth/components/SignInDialog";

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center"
  },
  submit: {
    opacity: 0.5,
    transition: "opacity .2s ease-in",
    "&:hover": {
      opacity: 1
    }
  },
  email: {
    margin: theme.spacing(1),
    padding: 0,
    flex: 1,
    color: "inherit",
    width: "130px"
  },
  input: {
    color: "inherit",
    padding: theme.spacing(1)
  }
}));

const StartSignInWidget = props => {
  const [email, setEmail] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = e => setEmail(e.target.value);
  const classes = useStyles();

  const handleSubmit = e => {
    setIsOpen(true);
    e.preventDefault();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={classes.container}>
        <div onClick={handleSubmit}>Sign in to start posting!</div>

        <form onSubmit={handleSubmit}>
          <Hidden xsDown>
            <Input
              className={classes.email}
              placeholder="enter email"
              margin="dense"
              disableUnderline
              name="email"
              size="small"
              value={email}
              onChange={handleChange}
              inputProps={{
                className: classes.input,
                "aria-label": "enter email"
              }}
            />
          </Hidden>
          <IconButton
            size="small"
            color="primary"
            aria-label="submit"
            className={classes.submit}
            onClick={handleSubmit}
          >
            <RightIcon color="primary" />
          </IconButton>
        </form>
      </div>

      {isOpen && (
        <SignInDialog
          isOpen={true}
          email={email}
          onCancel={handleClose}
          onLoggedIn={handleClose}
        />
      )}
    </>
  );
};
export default StartSignInWidget;
