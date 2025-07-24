// components/ChartSelectors.js
import React from "react";

const ChartSelectors = ({ activeChart, setActiveChart }) => {
  return (
    <>
      <div className="dashboard-chart-selectors">
        <div className="dashboard-chart-selector-buttons">
          <button
            className={`chart-selector-btn ${
              activeChart === "geral" ? "active" : ""
            }`}
            onClick={() => setActiveChart("geral")}
          >
            <span className="chart-selector-icon">📊</span>
            Distribuição por Área
          </button>
          <button
            className={`chart-selector-btn ${
              activeChart === "pendentes" ? "active" : ""
            }`}
            onClick={() => setActiveChart("pendentes")}
          >
            <span className="chart-selector-icon">⏳</span>
            Valores Selecionados por Área
          </button>
          <button
            className={`chart-selector-btn ${
              activeChart === "comprados" ? "active" : ""
            }`}
            onClick={() => setActiveChart("comprados")}
          >
            <span className="chart-selector-icon">✅</span>
            Valores Comprados por Área
          </button>
        </div>
      </div>

      <style jsx>{`
        .dashboard-chart-selectors {
          margin: 24px 0 16px;
        }

        .dashboard-chart-selector-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .chart-selector-btn {
          background: white;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chart-selector-btn:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .chart-selector-btn.active {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        .chart-selector-icon {
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .dashboard-chart-selector-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .chart-selector-btn {
            padding: 12px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
};

export default ChartSelectors;
