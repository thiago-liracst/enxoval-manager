// components/MetricsCards.js
import React from "react";
import { formatCurrency } from "../utils/formatUtils";

const MetricsCards = ({ metrics }) => {
  return (
    <div className="dashboard-metrics-grid">
      <div className="dashboard-metrics-card dashboard-metrics-total">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">Total de Itens</span>
          <span className="dashboard-metrics-card-value">
            {metrics.totalItems}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-purchased">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">Total Comprado</span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.totalPurchased)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-pending">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">
            Total Selecionado
          </span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.totalPending)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-available">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">
            Disponível para Escolha
          </span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.totalAvailable)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-average">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">
            Preço Médio por Item
          </span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.avgPricePerItem)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-highest">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">Maior Valor</span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.highestPrice)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-lowest">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">Menor Valor</span>
          <span className="dashboard-metrics-card-value">
            {formatCurrency(metrics.lowestPrice)}
          </span>
        </div>
      </div>

      <div className="dashboard-metrics-card dashboard-metrics-completion">
        <div className="dashboard-metrics-card-inner">
          <span className="dashboard-metrics-card-label">Conclusão</span>
          <div className="dashboard-metrics-progress-container">
            <div
              className="dashboard-metrics-progress-bar"
              style={{ width: `${metrics.completionPercentage}%` }}
            ></div>
            <span className="dashboard-metrics-progress-text">
              {metrics.completionPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
