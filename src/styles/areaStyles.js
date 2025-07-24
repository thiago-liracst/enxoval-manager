import { styled } from "@mui/material/styles";
import { Box, Card, Typography } from "@mui/material";

// Estilização dos componentes
export const AreaCard = styled(Card)(({ theme, bgcolor }) => ({
  height: "200px",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  backgroundColor: bgcolor || "#FFFFFF",
  border: `2px  ${theme.palette.primary.light}`,
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
}));

export const DragHandle = styled(Box)({
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
});

export const AreaIcon = styled(Typography)({
  fontSize: "2.5rem",
  color: "#1976d2",
  marginBottom: "8px",
});

export const IconSelector = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "16px",
  marginBottom: "16px",
  maxHeight: "250px",
  overflowY: "auto",
  padding: "10px",
  border: "1px solid #eee",
  borderRadius: "8px",
});

export const IconOption = styled(Box)(({ selected }) => ({
  width: "40px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  cursor: "pointer",
  borderRadius: "8px",
  backgroundColor: selected ? "#e3f2fd" : "#f5f5f5",
  border: selected ? "2px solid #1976d2" : "1px solid #ddd",
  "&:hover": {
    backgroundColor: "#e3f2fd",
  },
}));
