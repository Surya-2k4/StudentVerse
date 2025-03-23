import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');  // Store and get the role properly

  if (!token) {
    console.warn('No token found, redirecting to login');
    return <Navigate to="/" />;   // Redirect to login if no token
  }

  if (!allowedRoles.includes(role)) {
    console.warn('Unauthorized access, redirecting...');
    return <Navigate to="/unauthorized" />;   // Redirect if role is invalid
  }

  return children;  // Render the protected content
};

export default ProtectedRoute;
