// src/components/AreaPage.js
import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import ItemList from "../components/ItemList";
import ItemDetail from "../components/ItemDetail";
import ItemForm from "../components/ItemForm";

function AreaPage({ area }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  const handleAddItem = () => {
    setIsAddingItem(true);
  };

  const handleItemAdded = () => {
    setIsAddingItem(false);
    // Aqui você pode adicionar um efeito de atualização da lista
  };

  const handleCancelAddItem = () => {
    setIsAddingItem(false);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4 }}>
        {selectedItem ? (
          <ItemDetail item={selectedItem} onBack={handleBackToList} />
        ) : (
          <ItemList
            area={area}
            onSelectItem={handleSelectItem}
            onAddItem={handleAddItem}
          />
        )}

        <ItemForm
          area={area}
          onItemAdded={handleItemAdded}
          onCancel={handleCancelAddItem}
          open={isAddingItem}
        />
      </Box>
    </Container>
  );
}

export default AreaPage;
