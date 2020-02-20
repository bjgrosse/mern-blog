import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import SignInDialog from "../../components/SignInDialog";

const SignInPage = ({ history }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleCancel = () => {
    history.push("/");
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <SignInDialog isOpen={true} onCancel={handleCancel} />;
};
export default withRouter(SignInPage);
