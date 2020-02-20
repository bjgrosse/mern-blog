import React, { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";

import { checkEmail, registerUser, login } from "../AuthService";
import LoadingButton from "../../UI/LoadingButton/LoadingButton";
import useDataLoader from "../../util/useDataLoader";

const defaultFieldsState = {
  email: null,
  name: null,
  password: null,
  password2: null
};

/**
 * Displays the sign-in dialog. First we get the user's email and then
 * check to see if they have an existing account, then we either let them create
 * and account or supply their password to complete the signin.
 */
const SignInDialog = ({
  isOpen,
  onCancel,
  onLoggedIn,
  email,
  message,
  noAlerts
}) => {
  const [fields, setFields] = useState({ ...defaultFieldsState, email });
  const [showPassword, setShowPassword] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState();
  const [loadData, isLoading, errors, clearErrors] = useDataLoader();
  const [creatingNewAccount, setCreatingNewAccount] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const passwordRef = useRef();
  const nameRef = useRef();

  const handleChange = e => {
    const field = e.target.name;
    const value = e.target.value;

    setFields(fields => {
      let newFields = { ...fields };
      newFields[field] = value;
      return newFields;
    });
  };

  useEffect(() => {
    if (isOpen && email) {
      doSubmit();
    }
  }, [email, isOpen]);

  const handleClickShowPassword = () => {
    setShowPassword(showPassword => !showPassword);
  };
  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const doSubmit = () => {
    clearErrors();

    // If this is the first step, we check to see if the email exists
    if (checkedEmail !== fields.email) {
      loadData(checkEmail(fields.email), result => {
        setCreatingNewAccount(!result.exists);
        setCheckedEmail(fields.email);

        // Focus the next appropriate field
        if (result.exists) {
          passwordRef.current.focus();
        } else {
          nameRef.current.focus();
        }
      });
    } else if (creatingNewAccount) {
      loadData(registerUser(fields, dispatch), user => {
        if (onLoggedIn) onLoggedIn();

        if (!noAlerts) {
          enqueueSnackbar(`Welcome to your new account, ${user.name}!`, {
            variant: "success"
          });
        }
      });
    } else {
      loadData(login(fields, dispatch), user => {
        if (onLoggedIn) onLoggedIn();

        if (!noAlerts) {
          enqueueSnackbar(`Welcome back, ${user.name}!`, {
            variant: "success"
          });
        }
      });
    }
  };

  const handleSubmit = e => {
    doSubmit();
    e.preventDefault();
  };

  const hasCheckedEmail = checkedEmail && checkedEmail === fields.email;
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      onClose={onCancel}
      aria-labelledby="dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="dialog-title">
          {creatingNewAccount ? "Create New Account" : "Sign In"}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>{message}</DialogContentText>
          <TextField
            label="email"
            name="email"
            fullWidth
            autoFocus
            value={fields.email}
            error={errors.email}
            helperText={errors.email}
            onChange={handleChange}
            inputProps={{
              "aria-label": "enter email"
            }}
          />

          <Collapse in={hasCheckedEmail}>
            {creatingNewAccount && (
              <TextField
                label="name"
                name="name"
                inputRef={nameRef}
                fullWidth
                value={fields.name}
                error={errors.name}
                helperText={errors.name}
                onChange={handleChange}
                inputProps={{
                  "aria-label": "enter name"
                }}
              />
            )}
            <FormControl fullWidth error={errors.password}>
              <InputLabel htmlFor="password">password</InputLabel>
              <Input
                id="password"
                name="password"
                inputRef={passwordRef}
                type={showPassword ? "text" : "password"}
                value={fields.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      tabindex={-1}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText id="outlined-weight-helper-text">
                {errors.password}
              </FormHelperText>
            </FormControl>

            {creatingNewAccount && (
              <>
                <FormControl fullWidth error={errors.password2}>
                  <InputLabel htmlFor="password2">confirm password</InputLabel>
                  <Input
                    id="password2"
                    name="password2"
                    type={showPassword ? "text" : "password"}
                    value={fields.password2}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          tabindex={-1}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormHelperText>{errors.password2}</FormHelperText>
              </>
            )}
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary" tabindex={2}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            color="primary"
            isDefault
            tabindex={1}
            isLoading={isLoading}
          >
            {hasCheckedEmail ? "Submit" : "Next"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

SignInDialog.propTypes = {
  /** True to show the dialog */
  isOpen: PropTypes.bool,

  /** Called when the dialog is closed without submitting */
  onCancel: PropTypes.func,

  /** Called when the login succeeds */
  onLoggedIn: PropTypes.func,

  /** Don't show welcome alerts upon signin */
  noAlerts: PropTypes.bool
};
export default SignInDialog;
