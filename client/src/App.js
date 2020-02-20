import React from "react";
import PropTypes from "prop-types";
import Navbar from "./Nav/components/Navbar";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import Container from "@material-ui/core/Container";
import Box from "UI/Box/Box";
import PostListPage from "./Post/pages/PostListPage/PostListPage";
import PostDetailPage from "./Post/pages/PostDetailPage/PostDetailPage";
import SignInPage from "./Auth/pages/SignIn/SignPage";
import PrivateRoute from "./util/PrivateRoute";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App(props) {
  return (
    <SnackbarProvider maxSnack={1} autoHideDuration={3000}>
      <Provider store={props.store}>
        <Box absolute full>
          <Navbar />
          <Container maxWidth="md">
            <BrowserRouter>
              <Switch>
                <Route path="/" exact component={PostListPage} />
                <Route
                  path="/posts/:cuid/:slug"
                  exact
                  component={PostDetailPage}
                />
                <Route path="/signin" exact component={SignInPage} />
              </Switch>
            </BrowserRouter>
          </Container>
        </Box>
      </Provider>
    </SnackbarProvider>
  );
}

App.propTypes = {
  store: PropTypes.object.isRequired
};

export default App;
