import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import HR from "UI/HR/HR";
import StartSigninWidget from "./StartSignInWidget";
import ProfileMenu from "./ProfileMenu";

import { useSelector, connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 0,
    zIndex: 100,
    overflow: "hidden"
  },
  hr: {
    marginBottom: "20px"
  },
  toolbar: {
    background: "white",
    transition: "box-shadow .2s ease-in-out",
    boxShadow: props => `0px 10px ${props.elevate ? "20px" : "0px"} -20px black`
  },
  header: {
    flexGrow: 1
  },
  link: {
    color: "inherit",
    "&:hover": {
      color: "inherit"
    }
  }
}));

function Navbar() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const elevate = useScrollTrigger({ threshold: 25 });
  const classes = useStyles({ elevate });

  return (
    <>
      <Container maxWidth="md" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.header}>
            <Link href="/" className={classes.link}>
              <Typography variant="h6" display="inline">
                MERN Blog
              </Typography>
            </Link>
          </div>
          <Collapse in={!isAuthenticated}>
            <StartSigninWidget />{" "}
          </Collapse>
          {isAuthenticated && <ProfileMenu />}
        </Toolbar>
        <HR className={classes.hr}></HR>
      </Container>
      <Toolbar />
    </>
  );
}

export default connect()(Navbar);
