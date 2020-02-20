import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { updateUser } from "../AuthService";
import LoadingButton from "UI/LoadingButton/LoadingButton";
import useDataLoader from "util/useDataLoader";

/** Allows the user to update his/her profile */
const EditProfileDialog = ({ isOpen, onClose }) => {
  const [fields, setFields] = useState({});
  const user = useSelector(state => state.auth.user);
  const [loadData, isLoading, errors, clearErrors] = useDataLoader();
  const dispatch = useDispatch();
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
    setFields({ ...user });
  }, [user]);

  const doSubmit = () => {
    clearErrors();

    loadData(updateUser(fields, dispatch), onClose);
  };

  const handleSubmit = e => {
    doSubmit();
    e.preventDefault();
  };

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={isOpen}
      onClose={onClose}
      aria-labelledby="dialog-title"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="dialog-title">Edit profile</DialogTitle>
        <DialogContent dividers>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            onClick={handleSubmit}
            color="primary"
            isDefault
            isLoading={isLoading}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

EditProfileDialog.propTypes = {
  /** True to show the dialog */
  isOpen: PropTypes.bool,

  /** Called when the dialog is closed  */
  onClose: PropTypes.func
};
export default EditProfileDialog;
