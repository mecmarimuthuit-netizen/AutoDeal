import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Wishlist from "../pages/wishlist/Wishlist";

import Dashboard from "../pages/seller/Dashboard";
import Profile from "../pages/seller/Profile";
import MyCars from "../pages/seller/MyCars";

import CarListing from "../pages/cars/CarListing";
import CarDetails from "../pages/cars/CarDetails";
import AddCar from "../pages/cars/AddCar";
import EditCar from "../pages/cars/EditCar";

const NotFoundRedirect = () => {
  const { isAuthenticated, accessToken } = useSelector((state) => state.auth);
  const isLoggedIn = isAuthenticated || Boolean(accessToken);

  return <Navigate to={isLoggedIn ? "/" : "/login"} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<CarListing />} />
      <Route path="/cars" element={<CarListing />} />
      <Route path="/cars/:id" element={<CarDetails />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-cars" element={<MyCars />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/edit-car/:id" element={<EditCar />} />
      </Route>

      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
};

export default AppRoutes;