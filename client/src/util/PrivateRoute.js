import React from "react";
import { Route, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import SignInDialog from "../Auth/components/SignInDialog";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const handleCancel = () => {
    rest.history.push("/");
  };
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <SignInDialog isOpen={true} onCancel={handleCancel} />
        )
      }
    />
  );
};

export default withRouter(PrivateRoute);
