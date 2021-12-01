import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

// import { useUserContext } from "../context/user_context";

const PrivateRoute = ({ children, ...rest }) => {
  const { user } = useAuth0();

  if (rest.tok && !localStorage.getItem("tok")) {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={() => {
        return user ? children : <Redirect to="/" />;
      }}
    ></Route>
  );
};
export default PrivateRoute;
