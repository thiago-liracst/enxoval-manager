// components/DashboardChart.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency, renderMoneyTooltip } from "../utils/formatUtils";

const DashboardChart = ({ activeChart, metrics, areaColorMap }) => {
  const getChartData = () => {
    switch (activeChart) {
      case "geral":
        return metrics.categoryDistribution;
      case "pendentes":
        return metrics.pendingByArea;
      case "comprados":
        return metrics.purchasedByArea;
      default:
        return [];
    }
  };

  const getChartConfig = () => {
    const baseConfig = {
      XAxis: { dataKey: "name", stroke: "#666", fontSize: 12 },
      YAxis: { stroke: "#666", fontSize: 12 },
      Tooltip: {
        contentStyle: {
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          border: "none",
        },
      },
    };

    switch (activeChart) {
      case "geral":
        return {
          ...baseConfig,
          title: "📌 Distribuição por Área",
          barName: "Quantidade de Itens",
          tooltip: baseConfig.Tooltip,
          yAxisFormatter: null,
        };
      case "pendentes":
        return {
          ...baseConfig,
          title: "⏳ Valores Selecionados por Área",
          barName: "Valor Selecionado",
          tooltip: { ...baseConfig.Tooltip, content: renderMoneyTooltip },
          yAxisFormatter: (value) => formatCurrency(value).replace("R$", ""),
        };
      case "comprados":
        return {
          ...baseConfig,
          title: "✅ Valores Comprados por Área",
          barName: "Valor Comprado",
          tooltip: { ...baseConfig.Tooltip, content: renderMoneyTooltip },
          yAxisFormatter: (value) => formatCurrency(value).replace("R$", ""),
        };
      default:
        return baseConfig;
    }
  };

  const chartData = getChartData();
  const config = getChartConfig();

  return (
    <div className="dashboard-metrics-chart-container">
      <h3 className="dashboard-metrics-subtitle">{config.title}</h3>
      <div className="dashboard-metrics-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis {...config.XAxis} />
            <YAxis {...config.YAxis} tickFormatter={config.yAxisFormatter} />
            <Tooltip {...config.tooltip} />
            <Legend />
            <Bar dataKey="value" name={config.barName} radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={areaColorMap[entry.name]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
