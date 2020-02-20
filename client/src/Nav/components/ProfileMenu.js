import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import PersonIcon from "@material-ui/icons/Person";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { logout } from "Auth/AuthService";

import EditProfileDialog from "Auth/components/EditProfileDialog";

const ProfileMenu = props => {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const ref = useRef();
  const handleToggleMenu = () => {
    setShowMenu(value => !value);
  };

  const handleToggleProfile = () => {
    setIsProfileOpen(value => !value);
    setShowMenu(false);
  };

  const handleLogout = () => {
    logout(dispatch);
  };
  return (
    <>
      <IconButton
        ref={ref}
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleToggleMenu}
      >
        <PersonIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorOrigin={{ vertical: "bottom" }}
        anchorEl={ref.current}
        keepMounted
        open={showMenu}
        onClose={handleToggleMenu}
      >
        <MenuItem onClick={handleToggleProfile}>Edit profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <EditProfileDialog isOpen={isProfileOpen} onClose={handleToggleProfile} />
    </>
  );
};
export default ProfileMenu;
