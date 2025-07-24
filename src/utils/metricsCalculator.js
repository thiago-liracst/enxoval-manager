// utils/metricsCalculator.js
export const calculateMetrics = (items, areas, allOptions) => {
  const areaMap = areas.reduce((acc, area) => {
    acc[area.id] = area.nome;
    return acc;
  }, {});

  // Cria um mapa para armazenar métricas por área
  const areaMetrics = {};

  // Preparando estrutura de métricas
  areas.forEach((area) => {
    areaMetrics[area.nome] = {
      totalPurchased: 0,
      totalPending: 0,
      totalAvailable: 0,
      itemCount: 0,
      prices: [],
    };
  });

  // Adiciona área "Desconhecido" se não existir
  if (!areaMetrics["Desconhecido"]) {
    areaMetrics["Desconhecido"] = {
      totalPurchased: 0,
      totalPending: 0,
      totalAvailable: 0,
      itemCount: 0,
      prices: [],
    };
  }

  // Variáveis para totais globais
  let globalTotalPurchased = 0;
  let globalTotalPending = 0;
  let globalTotalAvailable = 0;
  let allPrices = [];

  // Processamento de todos os itens
  items.forEach((item) => {
    const itemOptions = allOptions.filter((opt) => opt.itemId === item.id);
    const areaNome = areaMap[item.area] || "Desconhecido";

    // Incrementa contagem de itens
    areaMetrics[areaNome].itemCount++;

    // Classifica e soma opções por status
    itemOptions.forEach((opt) => {
      // Garante que o preço seja um número válido
      const preco = parseFloat(opt.preco) || 0;

      switch (opt.status) {
        case "comprado":
          areaMetrics[areaNome].totalPurchased += preco;
          globalTotalPurchased += preco;
          break;
        case "pendente":
          areaMetrics[areaNome].totalPending += preco;
          globalTotalPending += preco;
          break;
        case "disponivel":
          areaMetrics[areaNome].totalAvailable += preco;
          globalTotalAvailable += preco;
          break;
      }

      // Adiciona preço às estatísticas (somente se for válido)
      if (preco > 0) {
        areaMetrics[areaNome].prices.push(preco);
        allPrices.push(preco);
      }
    });
  });

  return {
    areaMetrics,
    globalTotalPurchased,
    globalTotalPending,
    globalTotalAvailable,
    allPrices,
    allOptions,
  };
};

export const processChartData = (areaMetrics) => {
  const categoryDistribution = Object.entries(areaMetrics)
    .map(([name, data]) => ({
      name,
      value: data.itemCount,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const pendingByArea = Object.entries(areaMetrics)
    .map(([name, data]) => ({
      name,
      value: data.totalPending,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const purchasedByArea = Object.entries(areaMetrics)
    .map(([name, data]) => ({
      name,
      value: data.totalPurchased,
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return {
    categoryDistribution,
    pendingByArea,
    purchasedByArea,
  };
};

export const calculatePriceMetrics = (allPrices) => {
  const avgPricePerItem =
    allPrices.length > 0
      ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
      : 0;

  const highestPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const lowestPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

  return {
    avgPricePerItem,
    highestPrice,
    lowestPrice,
  };
};

export const calculateCompletionPercentage = (allOptions) => {
  return allOptions.length > 0
    ? (allOptions.filter((opt) => opt.status === "comprado").length /
        allOptions.length) *
        100
    : 0;
};
