import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <h1>🎨 Caption Studio</h1>
          <p>AI-Powered Image Captioning</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;