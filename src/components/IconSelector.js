import React from "react";
import { Typography, TextField } from "@mui/material";
import {
  IconSelector as StyledIconSelector,
  IconOption,
} from "../styles/areaStyles";
import { ICON_LIST } from "../constants/areaConstants";

function IconSelector({
  selectedIcon,
  setSelectedIcon,
  searchTerm,
  setSearchTerm,
}) {
  // Filtrar ícones pela pesquisa
  const filteredIcons = searchTerm
    ? ICON_LIST.filter((icon) => icon.includes(searchTerm))
    : ICON_LIST;

  return (
    <>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Ícone da área:
      </Typography>

      <TextField
        margin="dense"
        label="Pesquisar ícone"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <StyledIconSelector>
        {filteredIcons.map((icon) => (
          <IconOption
            key={icon}
            selected={selectedIcon === icon}
            onClick={() => setSelectedIcon(icon)}
          >
            {icon}
          </IconOption>
        ))}
      </StyledIconSelector>
    </>
  );
}

export default IconSelector;
