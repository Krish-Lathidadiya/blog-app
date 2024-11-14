// src/routes/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/admin/dashboard" />;
};

export default PublicRoute;
