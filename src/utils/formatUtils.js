// utils/formatUtils.js
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const renderMoneyTooltip = (props) => {
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
