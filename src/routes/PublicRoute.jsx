import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;