// src/components/ItemList.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Skeleton,
  styled,
} from "@mui/material";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { getItemsByArea, deleteItem, getItens } from "../services/firebase";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  minWidth: "48px",
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  padding: 0,
  boxShadow: "0 4px 10px rgba(30, 144, 255, 0.3)",
  "&:hover": {
    boxShadow: "0 6px 12px rgba(30, 144, 255, 0.4)",
  },
}));

function ItemList({ area, onSelectItem, onAddItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      if (!area) return;

      try {
        setLoading(true);
        const itemsData = await getItemsByArea(area.id);
        setItems(itemsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [area]);

  const handleDeleteClick = (itemId, event) => {
    // Evitar que o clique no botão excluir selecione o item
    event.stopPropagation();
    const itemToDelete = items.find((item) => item.id === itemId);
    setSelectedItem(itemToDelete);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItem(selectedItem.id);
      setItems(await getItens());
      if (onSelectItem) onSelectItem();
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Erro ao excluir Item:", error);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.descricao &&
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, color: "#1E90FF" }}>
          Carregando itens...
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={40} height={40} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Typography variant="h5" sx={{ flexGrow: 1, color: "#1E90FF" }}>
            Itens em {area.nome}
          </Typography>
          <AddButton
            variant="contained"
            color="primary"
            onClick={onAddItem}
            aria-label="add item"
          >
            <FaPlus />
          </AddButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#666" }}>
            Nenhum item cadastrado nesta área.
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ flexGrow: 1, color: "#1E90FF" }}>
          Itens em {area.nome}
        </Typography>
        <AddButton
          variant="contained"
          color="primary"
          onClick={onAddItem}
          aria-label="add item"
        >
          <FaPlus />
        </AddButton>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar itens..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <StyledCard onClick={() => onSelectItem(item)}>
              <CardContent sx={{ flexGrow: 1, borderRadius: "8px" }}>
                <Typography variant="h6" gutterBottom>
                  {item.nome}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {item.descricao || "Sem descrição"}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <Box component="span" sx={{ mr: 1, color: "#666" }}>
                      🔢
                    </Box>
                    Quantidade: {item.quantidade}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Box component="span" sx={{ mr: 1, color: "#666" }}>
                      🔣
                    </Box>
                    Opções: {item.opcoesCount || 0}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  aria-label="edit"
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  onClick={(e) => handleDeleteClick(item.id, e)}
                  aria-label="delete"
                  color="error"
                >
                  <FaTrash />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir o item "{selectedItem?.nome}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ItemList;
