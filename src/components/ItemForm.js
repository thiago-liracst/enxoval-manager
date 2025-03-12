// src/components/ItemForm.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { addItem } from "../services/firebase";

function ItemForm({ area, onItemAdded, onCancel, open }) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação
    const newErrors = {};
    if (itemName.trim() === "") {
      newErrors.name = "Por favor, informe o nome do item.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);

      const newItem = {
        nome: itemName.trim(),
        descricao: itemDescription.trim(),
        quantidade: Number(itemQuantity),
        area: area.id,
      };

      await addItem(newItem);

      // Limpar formulário
      setItemName("");
      setItemDescription("");
      setItemQuantity(1);
      setErrors({});

      setSubmitting(false);

      // Notificar que o item foi adicionado
      if (onItemAdded) onItemAdded();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      setSubmitting(false);
      setErrors({
        submit: "Erro ao adicionar item. Por favor, tente novamente.",
      });
    }
  };

  const handleClose = () => {
    setItemName("");
    setItemDescription("");
    setItemQuantity(1);
    setErrors({});
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adicionar Novo Item</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="itemName"
            label="Nome do Item"
            name="itemName"
            autoFocus
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Ex: Sofá, Toalhas, Geladeira"
          />
          <TextField
            margin="normal"
            fullWidth
            id="itemDescription"
            label="Descrição"
            name="itemDescription"
            multiline
            rows={3}
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Descrição ou observações sobre o item"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="itemQuantity"
            label="Quantidade"
            name="itemQuantity"
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
          />

          {errors.submit && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.submit}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            mr: 2,
            "&:hover": {
              color: "white",
            },
          }}
          onClick={handleClose}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? "Salvando..." : "Salvar Item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ItemForm;
