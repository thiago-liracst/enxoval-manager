// components/DashboardStyles.js
import React from "react";

const DashboardStyles = () => {
  return (
    <style jsx>{`
      .custom-tooltip {
        background-color: white;
        border-radius: 8px;
        padding: 10px 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: none;
      }

      .custom-tooltip .label {
        font-weight: 600;
        margin-bottom: 4px;
        color: #333;
      }

      .custom-tooltip .value {
        color: #555;
      }

      .dashboard-metrics-card.dashboard-metrics-available
        .dashboard-metrics-card-inner {
        border-top: 4px solid #ff9900;
      }
    `}</style>
  );
};

export default DashboardStyles;
