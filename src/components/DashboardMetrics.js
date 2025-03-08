import React, { useState, useEffect } from "react";
import {
  getAllItems,
  getOptionsByItem,
  getAreas,
  getOptions,
} from "../services/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function DashboardMetrics({ refreshTrigger }) {
  const [metrics, setMetrics] = useState({
    totalItems: 0,
    totalPurchased: 0,
    totalPending: 0,
    avgPricePerItem: 0,
    highestPrice: 0,
    lowestPrice: 0,
    completionPercentage: 0,
    categoryDistribution: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  // Cores para o gráfico
  const CHART_COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const items = await getAllItems();
        const areas = await getAreas();
        const options = await getOptions();
        const areaMap = areas.reduce((acc, area) => {
          acc[area.id] = area.nome;
          return acc;
        }, {});

        let totalPurchased = 0;
        let totalPending = 0;
        let totalPrices = [];
        let categoryMap = {};

        for (const item of items) {
          const options = await getOptionsByItem(item.id);
          const purchasedOptions = options.filter(
            (opt) => opt.status === "comprado"
          );
          const pendingOptions = options.filter(
            (opt) => opt.status === "pendente"
          );

          if (purchasedOptions.length > 0) {
            totalPurchased += purchasedOptions[0].preco;
          } else if (pendingOptions.length > 0) {
            const avgPending =
              pendingOptions.reduce((sum, opt) => sum + opt.preco, 0) /
              pendingOptions.length;
            totalPending += avgPending;
          }

          totalPrices.push(...options.map((opt) => opt.preco));

          const areaNome = areaMap[item.area] || "Desconhecido";
          categoryMap[areaNome] = (categoryMap[areaNome] || 0) + 1;
        }

        setMetrics({
          totalItems: items.length,
          totalPurchased,
          totalPending,
          avgPricePerItem:
            totalPrices.length > 0
              ? totalPrices.reduce((sum, p) => sum + p, 0) / totalPrices.length
              : 0,
          highestPrice: Math.max(...totalPrices),
          lowestPrice: Math.min(...totalPrices),
          completionPercentage:
            (options.filter((option) => option.status === "comprado").length /
              items.length) *
            100,
          categoryDistribution: Object.entries(categoryMap).map(
            ([key, value]) => ({ name: key, value })
          ),
        });
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [refreshTrigger]);

  // Formata valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="dashboard-metrics-container">
        <div className="dashboard-metrics-loading">
          <div className="dashboard-metrics-spinner"></div>
          <p>Carregando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-metrics-container">
      <div className="dashboard-metrics-header">
        <h2 className="dashboard-metrics-title">📊 Dashboard de Métricas</h2>
      </div>

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
            <span className="dashboard-metrics-card-label">Valor Pendente</span>
            <span className="dashboard-metrics-card-value">
              {formatCurrency(metrics.totalPending)}
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

      <div className="dashboard-metrics-chart-container">
        <h3 className="dashboard-metrics-subtitle">📌 Distribuição por Área</h3>
        <div className="dashboard-metrics-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.categoryDistribution}>
              <XAxis dataKey="name" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  border: "none",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {metrics.categoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default DashboardMetrics;
