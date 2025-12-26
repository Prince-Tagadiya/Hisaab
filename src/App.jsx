import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RequestsPage from './pages/RequestsPage';
import GroupPage from './pages/GroupPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import OfflineBanner from './components/OfflineBanner';
import InstallPrompter from './components/InstallPrompter';
import CreateAccountPage from './pages/CreateAccountPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsPage from './pages/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineBanner />
        <InstallPrompter />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsPage />} />
          
          <Route 
            path="/create-account" 
            element={
               <ProtectedRoute requireProfile={false}> 
                 {/* Special case: Authenticated but NO profile */}
                 <CreateAccountPage />
               </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/requests" 
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/group/:groupId" 
            element={
              <ProtectedRoute>
                 <GroupPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                 <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                 <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reset-db-hissab" 
            element={
              <ProtectedRoute>
                 <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
