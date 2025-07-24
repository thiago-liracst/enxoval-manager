import { useState, useEffect, useRef } from "react";
import {
  getAreas,
  addArea,
  cleanDuplicateAreas,
  deleteArea,
  updateArea,
} from "../services/firebase";
import {
  AREA_ICONS,
  DEFAULT_COLORS,
  DEFAULT_AREAS,
} from "../constants/areaConstants";

export function useAreaManager() {
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

  const contentBelowRef = useRef(null);

  // Carrega áreas do Firebase ao iniciar
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        await cleanDuplicateAreas();
        const areasData = await getAreas();

        if (areasData.length === 0) {
          await Promise.all(
            DEFAULT_AREAS.map((areaName, index) =>
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

  // Cria uma div de referência para scroll se não existir
  useEffect(() => {
    if (!contentBelowRef.current) {
      let contentBelowElement = document.getElementById("content-below");

      if (!contentBelowElement) {
        contentBelowElement = document.createElement("div");
        contentBelowElement.id = "content-below";
        document.querySelector("#root").appendChild(contentBelowElement);
      }

      contentBelowRef.current = contentBelowElement;
    }
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
        await updateArea(editAreaId, {
          nome: newArea.nome.trim(),
          icon: selectedIcon,
          color: newArea.color,
        });
        showNotification("Área atualizada com sucesso!");
      } else {
        await addArea({
          nome: newArea.nome.trim(),
          icon: selectedIcon,
          color: newArea.color,
        });
        showNotification("Nova área adicionada com sucesso!");
      }

      const updatedAreas = await getAreas();
      setAreas(updatedAreas);

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
    event.stopPropagation();
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
    event.stopPropagation();

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

    const suggestedIcon =
      AREA_ICONS[newName] || AREA_ICONS[newName.toLowerCase()];
    if (suggestedIcon && !isEditMode) {
      setSelectedIcon(suggestedIcon);
    }
  };

  // Reordenar áreas após arrastar e soltar
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newAreas = Array.from(areas);
    const [reorderedItem] = newAreas.splice(result.source.index, 1);
    newAreas.splice(result.destination.index, 0, reorderedItem);

    setAreas(newAreas);
  };

  // Função para lidar com a seleção de área e rolar para o conteúdo abaixo
  const handleSelectArea = (area, onSelectArea) => {
    onSelectArea(area);

    setTimeout(() => {
      if (contentBelowRef.current) {
        contentBelowRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return {
    // Estados
    areas,
    loading,
    isDialogOpen,
    isEditMode,
    selectedIcon,
    searchTerm,
    notification,
    newArea,
    contentBelowRef,

    // Setters
    setIsDialogOpen,
    setSelectedIcon,
    setSearchTerm,
    setNewArea,

    // Funções
    showNotification,
    handleCloseNotification,
    handleSaveArea,
    resetForm,
    handleEditArea,
    handleDeleteArea,
    handleAreaNameChange,
    handleDragEnd,
    handleSelectArea,
  };
}
