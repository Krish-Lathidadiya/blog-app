import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";

const OnlyAdminPrivateRoute = () => {
  const currentUser = useSelector(selectCurrentUser);
  return currentUser && currentUser?.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default OnlyAdminPrivateRoute;
