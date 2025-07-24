// utils/colorGenerator.js
export const generateColors = (count) => {
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

export const createAreaColorMap = (areaNames, colors) => {
  const areaColorMap = {};
  let colorIndex = 0;
  areaNames.forEach((name) => {
    areaColorMap[name] = colors[colorIndex++];
  });
  return areaColorMap;
};
