import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
  const location = useLocation();
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);

  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;