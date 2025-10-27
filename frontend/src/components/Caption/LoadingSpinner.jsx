import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <div className="loading-text">Analyzing your image...</div>
    </div>
  );
};

export default LoadingSpinner;