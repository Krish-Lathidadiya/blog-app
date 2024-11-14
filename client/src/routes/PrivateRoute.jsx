import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;


{/* <Outlet /> it is used to access called nested routes */}