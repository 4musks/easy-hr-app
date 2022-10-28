import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(props) {
  const { isLoggedIn, allowedRoles, role } = props;

  return isLoggedIn && allowedRoles?.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
}
