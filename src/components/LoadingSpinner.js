// components/LoadingSpinner.js
import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="dashboard-metrics-container">
      <div className="dashboard-metrics-loading">
        <div className="dashboard-metrics-spinner"></div>
        <p>Carregando métricas...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
