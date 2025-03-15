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
  Legend,
} from "recharts";

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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("geral");

  // Função para gerar cores dinamicamente com base no número de áreas
  const generateColors = (count) => {
    const baseColors = [
      "#8884d8",
      "#82ca9d",
      "#ffc658",
      "#ff8042",
      "#a4de6c",
      "#d0ed57",
      "#f783ac",
      "#6a8caf",
      "#ff7c43",
      "#2b908f",
      "#f1595f",
      "#79c36a",
      "#599ad3",
      "#f9a65a",
      "#9e66ab",
      "#cd7058",
      "#d77fb3",
      "#59a14f",
      "#9D02D7",
      "#0000ff",
    ];

    // Se tivermos mais áreas que cores base, gere cores adicionais
    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    } else {
      const colors = [...baseColors];
      // Gera cores adicionais
      for (let i = baseColors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 200) + 55; // Evita cores muito escuras
        const g = Math.floor(Math.random() * 200) + 55;
        const b = Math.floor(Math.random() * 200) + 55;
        colors.push(`rgb(${r}, ${g}, ${b})`);
      }
      return colors;
    }
  };

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
        let totalAvailable = 0;
        let totalPrices = [];
        let categoryMap = {};
        let pendingByAreaMap = {};
        let purchasedByAreaMap = {};

        // Inicializa todas as áreas com zero itens e valores
        areas.forEach((area) => {
          categoryMap[area.nome] = 0;
          pendingByAreaMap[area.nome] = 0;
          purchasedByAreaMap[area.nome] = 0;
        });

        for (const item of items) {
          const options = await getOptionsByItem(item.id);
          const purchasedOptions = options.filter(
            (opt) => opt.status === "comprado"
          );
          const pendingOptions = options.filter(
            (opt) => opt.status === "pendente"
          );
          const availableOptions = options.filter(
            (opt) => opt.status === "disponivel"
          );

          const areaNome = areaMap[item.area] || "Desconhecido";
          categoryMap[areaNome] = (categoryMap[areaNome] || 0) + 1;

          // Calculando valor dos itens comprados
          purchasedOptions.forEach((option) => {
            totalPurchased += option.preco;
            purchasedByAreaMap[areaNome] =
              (purchasedByAreaMap[areaNome] || 0) + option.preco;
          });

          // Calculando valor dos itens pendentes (selecionados)
          pendingOptions.forEach((option) => {
            totalPending += option.preco;
            pendingByAreaMap[areaNome] =
              (pendingByAreaMap[areaNome] || 0) + option.preco;
          });

          // Calculando valor total dos itens disponíveis (não selecionados)
          availableOptions.forEach((option) => {
            totalAvailable += option.preco;
          });

          // Adicionando todos os preços para cálculos estatísticos
          options.forEach((option) => {
            totalPrices.push(option.preco);
          });
        }

        // Converte os mapas para arrays para os gráficos
        const categoryDistribution = Object.entries(categoryMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        const pendingByArea = Object.entries(pendingByAreaMap)
          .map(([name, value]) => ({ name, value }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value);

        const purchasedByArea = Object.entries(purchasedByAreaMap)
          .map(([name, value]) => ({ name, value }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value);

        // Calculando a porcentagem de conclusão com base nas opções marcadas como compradas
        const totalOptions = options.length;
        const completedOptions = options.filter(
          (opt) => opt.status === "comprado"
        ).length;
        const completionPercentage =
          totalOptions > 0 ? (completedOptions / totalOptions) * 100 : 0;

        setMetrics({
          totalItems: items.length,
          totalPurchased,
          totalPending,
          totalAvailable,
          avgPricePerItem:
            totalPrices.length > 0
              ? totalPrices.reduce((sum, p) => sum + p, 0) / totalPrices.length
              : 0,
          highestPrice: Math.max(...totalPrices, 0),
          lowestPrice: Math.min(
            ...(totalPrices.length > 0 ? totalPrices : [0])
          ),
          completionPercentage,
          categoryDistribution,
          pendingByArea,
          purchasedByArea,
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

  // Renderiza o tooltip para valores monetários
  const renderMoneyTooltip = (props) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}`}</p>
          <p className="value">{`${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
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

  // Gera cores dinamicamente com base no número máximo de áreas
  const areaNames = new Set([
    ...metrics.categoryDistribution.map((item) => item.name),
    ...metrics.pendingByArea.map((item) => item.name),
    ...metrics.purchasedByArea.map((item) => item.name),
  ]);
  const chartColors = generateColors(areaNames.size);

  // Cria um mapeamento de nomes de áreas para cores
  const areaColorMap = {};
  let colorIndex = 0;
  areaNames.forEach((name) => {
    areaColorMap[name] = chartColors[colorIndex++];
  });

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

      {/* Seletores de Gráficos - Estilização Moderna */}
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

      {/* Gráficos */}
      <div className="dashboard-metrics-chart-container">
        {activeChart === "geral" && (
          <>
            <h3 className="dashboard-metrics-subtitle">
              📌 Distribuição por Área
            </h3>
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
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Quantidade de Itens"
                    radius={[4, 4, 0, 0]}
                  >
                    {metrics.categoryDistribution.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={areaColorMap[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeChart === "pendentes" && (
          <>
            <h3 className="dashboard-metrics-subtitle">
              ⏳ Valores Selecionados por Área
            </h3>
            <div className="dashboard-metrics-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.pendingByArea}>
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) =>
                      formatCurrency(value).replace("R$", "")
                    }
                  />
                  <Tooltip
                    content={renderMoneyTooltip}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Valor Selecionado"
                    radius={[4, 4, 0, 0]}
                  >
                    {metrics.pendingByArea.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={areaColorMap[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeChart === "comprados" && (
          <>
            <h3 className="dashboard-metrics-subtitle">
              ✅ Valores Comprados por Área
            </h3>
            <div className="dashboard-metrics-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.purchasedByArea}>
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis
                    stroke="#666"
                    fontSize={12}
                    tickFormatter={(value) =>
                      formatCurrency(value).replace("R$", "")
                    }
                  />
                  <Tooltip
                    content={renderMoneyTooltip}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Valor Comprado"
                    radius={[4, 4, 0, 0]}
                  >
                    {metrics.purchasedByArea.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={areaColorMap[entry.name]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {/* CSS para os seletores de gráficos */}
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

        /* Para telas menores */
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

        /* Estilização adicional para o tooltip */
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

        /* Novos estilos para o card de itens disponíveis */
        .dashboard-metrics-card.dashboard-metrics-available
          .dashboard-metrics-card-inner {
          background: linear-gradient(135deg, #64b5f6, #2196f3);
        }
      `}</style>
    </div>
  );
}

export default DashboardMetrics;
