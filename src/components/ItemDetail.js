// src/components/ItemDetail.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Divider,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaArrowLeft, FaEdit, FaPlus } from "react-icons/fa";
import { getOptionsByItem, updateItem } from "../services/firebase";
import OptionList from "./OptionList";
import OptionForm from "./OptionForm";

function ItemDetail({ item, onBack }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({
    nome: item.nome,
    descricao: item.descricao,
    quantidade: item.quantidade,
  });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const optionsData = await getOptionsByItem(item.id);
        setOptions(optionsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar opções:", error);
        setLoading(false);
        setSnackbar({
          open: true,
          message: "Erro ao carregar opções",
          severity: "error",
        });
      }
    };

    fetchOptions();
  }, [item.id, refreshTrigger]);

  const handleAddOption = () => {
    setIsAddingOption(true);
  };

  const handleOptionAdded = () => {
    setIsAddingOption(false);
    setRefreshTrigger((prev) => prev + 1);
    setSnackbar({
      open: true,
      message: "Opção adicionada com sucesso",
      severity: "success",
    });
  };

  const handleCancelAddOption = () => {
    setIsAddingOption(false);
  };

  const handleOptionStatusChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      await updateItem(item.id, editedItem);
      setIsEditing(false);
      setRefreshTrigger((prev) => prev + 1);
      setSaving(false);
      setSnackbar({
        open: true,
        message: "Item atualizado com sucesso",
        severity: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      setSaving(false);
      setSnackbar({
        open: true,
        message: "Erro ao atualizar item",
        severity: "error",
      });
    }
  };

  const handleCancelEdit = () => {
    setEditedItem({
      nome: item.nome,
      descricao: item.descricao,
      quantidade: item.quantidade,
    });
    setIsEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Button
          startIcon={<FaArrowLeft />}
          onClick={onBack}
          variant="outlined"
          sx={{
            mr: 2,
            "&:hover": {
              color: "white",
              backgroundColor: "#1E90FF",
              borderColor: "#1E90FF",
            },
          }}
        >
          Voltar para Lista
        </Button>
        <Typography variant="h5" sx={{ color: "#1E90FF" }}>
          Detalhes do Item
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          {isEditing ? (
            <Box component="form" noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome do Item"
                value={editedItem.nome}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, nome: e.target.value })
                }
              />
              <TextField
                margin="normal"
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={editedItem.descricao}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, descricao: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Quantidade"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={editedItem.quantidade}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, quantidade: e.target.value })
                }
              />
              <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={handleCancelEdit}
                  sx={{
                    mr: 2,
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  {item.nome}
                </Typography>
                <Button
                  sx={{
                    mr: 2,
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  variant="outlined"
                  startIcon={<FaEdit />}
                  onClick={handleEdit}
                >
                  Editar Item
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Descrição:
              </Typography>
              <Typography paragraph sx={{ mb: 3 }}>
                {item.descricao || "Sem descrição"}
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Quantidade:
              </Typography>
              <Typography>{item.quantidade}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6">Opções de Compra</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaPlus />}
              onClick={handleAddOption}
            >
              Nova Opção
            </Button>
          </Box>

          {isAddingOption ? (
            <OptionForm
              item={item}
              onOptionAdded={handleOptionAdded}
              onCancel={handleCancelAddOption}
            />
          ) : loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <OptionList
              options={options}
              onStatusChange={handleOptionStatusChange}
            />
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ItemDetail;
