import React, { useState, useEffect } from "react";
import { getAllItems, getAreas, getOptions } from "../services/firebase";

// Componentes modularizados
import LoadingSpinner from "./LoadingSpinner";
import MetricsCards from "./MetricsCards";
import ChartSelectors from "./ChartSelectors";
import DashboardChart from "./DashboardChart";
import DashboardStyles from "./DashboardStyles";

// Utilitários modularizados
import { generateColors, createAreaColorMap } from "../utils/colorGenerator";
import {
  calculateMetrics,
  processChartData,
  calculatePriceMetrics,
  calculateCompletionPercentage,
} from "../utils/metricsCalculator";

function DashboardMetrics({ refreshTrigger }) {
  const [metrics, setMetrics] = useState({
    totalItems: 0,
    totalPurchased: 0,
    totalPending: 0,
    totalAvailable: 0,
    avgPricePerItem: 0,
    highestPrice: 0,
    lowestPrice: 0,
    completionPercentage: 0,
    categoryDistribution: [],
    pendingByArea: [],
    purchasedByArea: [],
    totalItemsPurchased: 0,
    totalItemsSelected: 0,
    totalValueAllItems: 0,
    totalOptions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("geral");

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const items = await getAllItems();
        const areas = await getAreas();
        const allOptions = await getOptions();

        // Calcula métricas usando função modularizada
        const {
          areaMetrics,
          globalTotalPurchased,
          globalTotalPending,
          globalTotalAvailable,
          allPrices,
          totalItemsPurchased,
          totalItemsSelected,
          totalValueAllItems,
        } = calculateMetrics(items, areas, allOptions);

        // Processa dados dos gráficos
        const chartData = processChartData(areaMetrics);

        // Calcula métricas de preço
        const priceMetrics = calculatePriceMetrics(allPrices);

        // Calcula porcentagem de conclusão
        const completionPercentage = calculateCompletionPercentage(allOptions);

        // Debug: log dos valores calculados
        console.log("Métricas calculadas:", {
          totalPurchased: globalTotalPurchased,
          totalPending: globalTotalPending,
          totalAvailable: globalTotalAvailable,
          totalItemsPurchased,
          totalItemsSelected,
          totalValueAllItems,
          avgPricePerItem: priceMetrics.avgPricePerItem,
          highestPrice: priceMetrics.highestPrice,
          lowestPrice: priceMetrics.lowestPrice,
          allOptionsCount: allOptions.length,
          allPricesCount: allPrices.length,
        });

        setMetrics({
          totalItems: items.length,
          totalPurchased: globalTotalPurchased,
          totalPending: globalTotalPending,
          totalAvailable: globalTotalAvailable,
          totalItemsPurchased,
          totalItemsSelected,
          totalValueAllItems,
          totalOptions: allOptions.length,
          ...priceMetrics,
          completionPercentage,
          ...chartData,
        });
      } catch (error) {
        console.error("Erro ao buscar métricas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [refreshTrigger]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Gera cores dinamicamente com base no número máximo de áreas
  const areaNames = new Set([
    ...metrics.categoryDistribution.map((item) => item.name),
    ...metrics.pendingByArea.map((item) => item.name),
    ...metrics.purchasedByArea.map((item) => item.name),
  ]);
  const chartColors = generateColors(areaNames.size);
  const areaColorMap = createAreaColorMap(areaNames, chartColors);

  return (
    <div className="dashboard-metrics-container">
      <div className="dashboard-metrics-header">
        <h2 className="dashboard-metrics-title">📊 Dashboard de Métricas</h2>
      </div>

      <MetricsCards metrics={metrics} />

      <ChartSelectors
        activeChart={activeChart}
        setActiveChart={setActiveChart}
      />

      <DashboardChart
        activeChart={activeChart}
        metrics={metrics}
        areaColorMap={areaColorMap}
      />

      <DashboardStyles />
    </div>
  );
}

export default DashboardMetrics;
