import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, ...rest }) => {
  const { user, isAuthenticated } = useAuth0();
  const isName = user && isAuthenticated;

  console.log(useAuth0());
  
  return (
    <Route {...rest}>
      {isName ? children : <Redirect to="/login"></Redirect>}
    </Route>
  );
};
export default PrivateRoute;
