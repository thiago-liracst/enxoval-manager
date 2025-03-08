import React, { useState, useEffect } from "react";
import { getAllItems, getOptionsByItem, getAreas } from "../services/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const items = await getAllItems();
        const areas = await getAreas();
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
            (items.filter((item) => item.status === "comprado").length /
              items.length) *
            100,
          categoryDistribution: Object.entries(categoryMap).map(
            ([key, value]) => ({ name: key, value })
          ),
        });
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
      }
    };

    fetchMetrics();
  }, [refreshTrigger]); // 🔄 Atualiza sempre que refreshTrigger mudar

  return (
    <div className="dashboard-metrics">
      <h2>📊 Dashboard de Métricas</h2>
      <div className="metrics-grid">
        <div className="metric-box">Total de Itens: {metrics.totalItems}</div>
        <div className="metric-box">
          Total Comprado: R$ {metrics.totalPurchased.toFixed(2)}
        </div>
        <div className="metric-box">
          Valor Pendente: R$ {metrics.totalPending.toFixed(2)}
        </div>
        <div className="metric-box">
          Preço Médio por Item: R$ {metrics.avgPricePerItem.toFixed(2)}
        </div>
        <div className="metric-box">
          Maior Valor: R$ {metrics.highestPrice.toFixed(2)}
        </div>
        <div className="metric-box">
          Menor Valor: R$ {metrics.lowestPrice.toFixed(2)}
        </div>
        <div className="metric-box">
          Conclusão: {metrics.completionPercentage.toFixed(2)}%
        </div>
      </div>

      <h3>📌 Distribuição por Área</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metrics.categoryDistribution}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardMetrics;
