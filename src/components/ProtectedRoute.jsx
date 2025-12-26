import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requireProfile = true }) {
  const { currentUser, userProfile } = useAuth();
  
  // 1. Not logged in -> Login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. Logged in, but NO profile yet
  // If this route REQUIRES a profile (default), redirect to create account
  if (requireProfile && !userProfile) {
     return <Navigate to="/create-account" />;
  }

  // 3. Logged in WITH profile
  // If this route DOES NOT require profile (e.g. Create Account page), user shouldn't be here -> Dashboard
  if (!requireProfile && userProfile) {
      return <Navigate to="/dashboard" />;
  }

  return children;
}
