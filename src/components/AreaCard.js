import React from "react";
import {
  Grid,
  Box,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { FaGripVertical, FaTrash, FaPencilAlt } from "react-icons/fa";
import { Draggable } from "react-beautiful-dnd";
import {
  AreaCard as StyledAreaCard,
  DragHandle,
  AreaIcon,
} from "../styles/areaStyles";

function AreaCard({
  area,
  index,
  handleSelectArea,
  handleEditArea,
  handleDeleteArea,
}) {
  return (
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
          <StyledAreaCard
            elevation={snapshot.isDragging ? 8 : 2}
            onClick={() => handleSelectArea(area)}
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
          </StyledAreaCard>
        </Grid>
      )}
    </Draggable>
  );
}

export default AreaCard;
