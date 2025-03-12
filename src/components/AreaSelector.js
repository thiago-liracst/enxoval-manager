import React, { useState, useEffect } from "react";
import {
  getAreas,
  addArea,
  cleanDuplicateAreas,
  deleteArea,
  updateArea,
} from "../services/firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { FaPlus, FaGripVertical, FaTrash, FaPencilAlt } from "react-icons/fa";

// Estilização dos componentes
const AreaCard = styled(Card)(({ theme, bgcolor }) => ({
  height: "200px",
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  backgroundColor: bgcolor || "#FFFFFF",
  border: `2px solid ${theme.palette.primary.light}`,
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const DragHandle = styled(Box)({
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px",
});

const AreaIcon = styled(Typography)({
  fontSize: "2.5rem",
  color: "#1976d2", // Cor azul padrão do Material UI
  marginBottom: "8px",
});

const IconSelector = styled(Box)({
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

const IconOption = styled(Box)(({ selected }) => ({
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

// Ícones expandidos (mantido do código original)
const AREA_ICONS = {
  Sala: "🏠",
  Cozinha: "🍽️",
  Banheiro: "🚿",
  Quarto: "🛌",
  Lavanderia: "👕",
  Teto: "⬆️",
  Piso: "⬇️",
  Estrutura: "🏗️",
  Elétrica: "💡",
  Varanda: "🏞️",
  Escritório: "💼",
  "Área de Serviço": "🧹",
  Garagem: "🚗",
  Jardim: "🌱",
  Despensa: "🥫",
  Closet: "👚",
  "Sala de Jantar": "🍽️",
  "Quarto de Hóspedes": "🏨",
  "Sala de Estar": "🛋️",
  "Área Comum": "👥",
  "Área Externa": "🌳",
  Corredor: "🚶",
  Hall: "🚪",
  "Home Office": "💻",
  "Área Gourmet": "🍳",
  Piscina: "🏊",
  Deck: "🪑",
  // Novos ícones adicionados
  Suite: "👑",
  "Área de Lazer": "🎯",
  Academia: "🏋️",
  Sacada: "🌇",
  "Sala de TV": "📺",
  "Sala de Jogos": "🎮",
  Biblioteca: "📚",
  Adega: "🍷",
  Terraço: "🏔️",
  "Quarto de Bebê": "👶",
  Cobertura: "🌆",
  "Espaço Gourmet": "🥘",
  Porão: "🕳️",
  Sótão: "🔝",
};

// Lista de ícones para seleção (expandida)
const ICON_LIST = [
  "🏠",
  "🍽️",
  "🚿",
  "🛌",
  "👕",
  "⬆️",
  "⬇️",
  "🏗️",
  "💡",
  "🏞️",
  "💼",
  "🧹",
  "🚗",
  "🌱",
  "🥫",
  "👚",
  "🍽️",
  "🏨",
  "🛋️",
  "👥",
  "🌳",
  "🚶",
  "🚪",
  "💻",
  "🍳",
  "🏊",
  "🪑",
  "📱",
  "📺",
  "🧰",
  "🧼",
  "🧴",
  "🪞",
  "🧸",
  "📚",
  "🎮",
  "🎵",
  "🧠",
  "🎨",
  "🏋️",
  "🧘",
  "🧶",
  "🧵",
  "🪄",
  "🔨",
  "🪓",
  "🧲",
  "⚙️",
  "🛠️",
  "🔧",
  "🔌",
  "🧯",
  "🪜",
  "🪣",
  "🧽",
  "🔍",
  "📦",
  "🏺",
  "🏮",
  "🎪",
  "🌅",
  "🏙️",
  "🌃",
  "🌉",
  "🎭",
  "👑",
  "🎯",
  "🏋️",
  "🌇",
  "📺",
  "🎮",
  "📚",
  "🍷",
  "🏔️",
  "👶",
  "🌆",
  "🥘",
  "🕳️",
  "🔝",
  "🌿",
  "🧊",
  "🧬",
  "🌡️",
  "🧪",
  "🔬",
  "🔭",
  "💎",
  "🪴",
  "🎁",
  "🧩",
];

// Cores padrão para novas áreas
const DEFAULT_COLORS = [
  "#E3F2FD",
  "#E8EAF6",
  "#F3E5F5",
  "#E1F5FE",
  "#E0F7FA",
  "#F1F8E9",
  "#FFF8E1",
  "#FFEBEE",
  "#F9FBE7",
  "#F5F5F5",
  "#EFEBE9",
  "#F3E5F5",
  "#E8F5E9",
  "#FFF3E0",
  "#EDE7F6",
];

function AreaSelector({ onSelectArea }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("🏠");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [editAreaId, setEditAreaId] = useState(null);
  const [newArea, setNewArea] = useState({
    nome: "",
    icon: "🏠",
    color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
  });

  // Carrega áreas do Firebase ao iniciar
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        await cleanDuplicateAreas();
        const areasData = await getAreas();

        if (areasData.length === 0) {
          // Cria áreas padrão se não existirem
          const defaultAreas = ["Sala", "Cozinha", "Banheiro", "Quarto"];
          await Promise.all(
            defaultAreas.map((areaName, index) =>
              addArea({
                nome: areaName,
                icon: AREA_ICONS[areaName] || "🏠",
                color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
              })
            )
          );
          const newAreasData = await getAreas();
          setAreas(newAreasData);
        } else {
          // Adiciona ícone e cor padrão para áreas existentes que não os têm
          const enhancedAreas = areasData.map((area, index) => ({
            ...area,
            icon: area.icon || AREA_ICONS[area.nome] || "🏠",
            color: area.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          }));
          setAreas(enhancedAreas);
        }
      } catch (error) {
        console.error("Erro ao carregar áreas:", error);
        showNotification("Erro ao carregar áreas", "error");
      }
      setLoading(false);
    };

    fetchAreas();
  }, []);

  // Mostrar notificação
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  // Fechar notificação
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Adicionar nova área ou atualizar existente
  const handleSaveArea = async () => {
    if (!newArea.nome.trim()) {
      showNotification("O nome da área não pode ser vazio", "error");
      return;
    }

    // Verifica duplicidade apenas se for nova área (não edição)
    if (
      !isEditMode &&
      areas.some(
        (area) => area.nome.toLowerCase() === newArea.nome.trim().toLowerCase()
      )
    ) {
      showNotification("Já existe uma área com este nome!", "warning");
      return;
    }

    try {
      if (isEditMode && editAreaId) {
        // Atualiza área existente
        await updateArea(editAreaId, {
          nome: newArea.nome.trim(),
          icon: selectedIcon,
          color: newArea.color,
        });
        showNotification("Área atualizada com sucesso!");
      } else {
        // Adiciona nova área
        await addArea({
          nome: newArea.nome.trim(),
          icon: selectedIcon,
          color: newArea.color,
        });
        showNotification("Nova área adicionada com sucesso!");
      }

      // Recarrega áreas após adicionar/atualizar
      const updatedAreas = await getAreas();
      setAreas(updatedAreas);

      // Reseta form e fecha diálogo
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar área:", error);
      showNotification("Erro ao salvar área", "error");
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setNewArea({
      nome: "",
      icon: "🏠",
      color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
    });
    setSelectedIcon("🏠");
    setIsEditMode(false);
    setEditAreaId(null);
  };

  // Abrir modal para editar área
  const handleEditArea = (area, event) => {
    event.stopPropagation(); // Evita propagar o clique para o cartão
    setIsEditMode(true);
    setEditAreaId(area.id);
    setNewArea({
      nome: area.nome,
      color: area.color || DEFAULT_COLORS[0],
    });
    setSelectedIcon(area.icon || "🏠");
    setIsDialogOpen(true);
  };

  // Excluir área
  const handleDeleteArea = async (areaId, event) => {
    event.stopPropagation(); // Evita propagar o clique para o cartão

    if (!window.confirm("Tem certeza que deseja excluir esta área?")) return;

    try {
      await deleteArea(areaId);
      const updatedAreas = await getAreas();
      setAreas(updatedAreas);
      showNotification("Área excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir área:", error);
      showNotification("Erro ao excluir área", "error");
    }
  };

  // Sugestão automática de ícone ao digitar o nome da área
  const handleAreaNameChange = (e) => {
    const newName = e.target.value;
    setNewArea({ ...newArea, nome: newName });

    // Verifica se tem um ícone sugerido para o nome
    const suggestedIcon =
      AREA_ICONS[newName] || AREA_ICONS[newName.toLowerCase()];
    if (suggestedIcon && !isEditMode) {
      setSelectedIcon(suggestedIcon);
    }
  };

  // Filtrar ícones pela pesquisa
  const filteredIcons = searchTerm
    ? ICON_LIST.filter((icon) => icon.includes(searchTerm))
    : ICON_LIST;

  // Reordenar áreas após arrastar e soltar
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newAreas = Array.from(areas);
    const [reorderedItem] = newAreas.splice(result.source.index, 1);
    newAreas.splice(result.destination.index, 0, reorderedItem);

    setAreas(newAreas);

    // Aqui você poderia implementar a atualização da ordem no Firebase
    // se necessário para persistir a ordem das áreas
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando áreas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Áreas da Casa</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          Nova Área
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="areas" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={3}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {areas.length > 0 ? (
                areas.map((area, index) => (
                  <Draggable key={area.id} draggableId={area.id} index={index}>
                    {(provided, snapshot) => (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <AreaCard
                          elevation={snapshot.isDragging ? 8 : 2}
                          onClick={() => onSelectArea(area)}
                          bgcolor={area.color}
                        >
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <DragHandle {...provided.dragHandleProps}>
                              <FaGripVertical style={{ color: "#1976d2" }} />
                            </DragHandle>
                            <Box>
                              <Tooltip title="Editar área">
                                <IconButton
                                  onClick={(e) => handleEditArea(area, e)}
                                  sx={{ color: "#1976d2" }}
                                >
                                  <FaPencilAlt />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir área">
                                <IconButton
                                  onClick={(e) => handleDeleteArea(area.id, e)}
                                  sx={{ color: "#f44336" }}
                                >
                                  <FaTrash />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <AreaIcon>{area.icon}</AreaIcon>
                            <Typography
                              variant="h6"
                              sx={{ color: "#1976d2", fontWeight: "500" }}
                            >
                              {area.nome}
                            </Typography>
                          </CardContent>
                        </AreaCard>
                      </Grid>
                    )}
                  </Draggable>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Nenhuma área cadastrada. Clique no botão "Nova Área" para
                      começar.
                    </Typography>
                  </Box>
                </Grid>
              )}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

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

          <IconSelector>
            {filteredIcons.map((icon) => (
              <IconOption
                key={icon}
                selected={selectedIcon === icon}
                onClick={() => setSelectedIcon(icon)}
              >
                {icon}
              </IconOption>
            ))}
          </IconSelector>

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

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AreaSelector;
