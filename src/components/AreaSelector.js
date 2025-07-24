import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useAreaManager } from "../hooks/useAreaManager";
import AreaCard from "./AreaCard";
import AreaDialog from "./AreaDialog";
import Notification from "./Notification";

function AreaSelector({ onSelectArea }) {
  const {
    areas,
    loading,
    isDialogOpen,
    isEditMode,
    selectedIcon,
    searchTerm,
    notification,
    newArea,
    contentBelowRef,
    setIsDialogOpen,
    setSelectedIcon,
    setSearchTerm,
    setNewArea,
    handleCloseNotification,
    handleSaveArea,
    resetForm,
    handleEditArea,
    handleDeleteArea,
    handleAreaNameChange,
    handleDragEnd,
    handleSelectArea,
  } = useAreaManager();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Carregando áreas...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: 3, minHeight: "80%", backgroundColor: "#f5f5f5" }}>
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
                    <AreaCard
                      key={area.id}
                      area={area}
                      index={index}
                      handleSelectArea={(area) =>
                        handleSelectArea(area, onSelectArea)
                      }
                      handleEditArea={handleEditArea}
                      handleDeleteArea={handleDeleteArea}
                    />
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
                        Nenhuma área cadastrada. Clique no botão "Nova Área"
                        para começar.
                      </Typography>
                    </Box>
                  </Grid>
                )}
                {provided.placeholder}
              </Grid>
            )}
          </Droppable>
        </DragDropContext>

        <AreaDialog
          isDialogOpen={isDialogOpen}
          isEditMode={isEditMode}
          newArea={newArea}
          selectedIcon={selectedIcon}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedIcon={setSelectedIcon}
          handleAreaNameChange={handleAreaNameChange}
          handleSaveArea={handleSaveArea}
          resetForm={resetForm}
          setIsDialogOpen={setIsDialogOpen}
          setNewArea={setNewArea}
        />

        <Notification
          notification={notification}
          handleCloseNotification={handleCloseNotification}
        />
      </Box>

      {/* Elemento de referência para o scroll */}
      <div id="content-below" ref={contentBelowRef}></div>
    </>
  );
}

export default AreaSelector;
