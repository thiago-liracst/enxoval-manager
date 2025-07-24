import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import IconSelector from "./IconSelector";

function AreaDialog({
  isDialogOpen,
  isEditMode,
  newArea,
  selectedIcon,
  searchTerm,
  setSearchTerm,
  setSelectedIcon,
  handleAreaNameChange,
  handleSaveArea,
  resetForm,
  setIsDialogOpen,
  setNewArea,
}) {
  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        resetForm();
        setIsDialogOpen(false);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {isEditMode ? "Editar Área" : "Adicionar Nova Área"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Área"
          fullWidth
          value={newArea.nome}
          onChange={handleAreaNameChange}
          required
        />

        <IconSelector
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Cor do cartão:
        </Typography>

        <TextField
          margin="dense"
          label="Cor"
          type="color"
          fullWidth
          value={newArea.color}
          onChange={(e) => setNewArea({ ...newArea, color: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(false);
          }}
          sx={{
            mr: 2,
            "&:hover": {
              color: "white",
            },
          }}
        >
          Cancelar
        </Button>
        <Button onClick={handleSaveArea} variant="contained" color="primary">
          {isEditMode ? "Atualizar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AreaDialog;
