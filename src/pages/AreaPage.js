// src/components/AreaPage.js
import React, { useState } from "react";
import ItemList from "../components/ItemList";
import ItemForm from "../components/ItemForm";
import ItemDetail from "../components/ItemDetail";

function AreaPage({ area }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setIsAddingItem(false);
  };

  const handleAddItem = () => {
    setIsAddingItem(true);
    setSelectedItem(null);
  };

  const handleItemAdded = () => {
    setIsAddingItem(false);
    // Atualiza a lista de itens
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelAddItem = () => {
    setIsAddingItem(false);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  if (!area) {
    return <div>Selecione uma área para ver seus itens.</div>;
  }

  return (
    <div className="area-page">
      <h2>Área: {area.nome}</h2>

      {!selectedItem && !isAddingItem && (
        <div className="area-actions">
          <button onClick={handleAddItem}>Adicionar Novo Item</button>
        </div>
      )}

      {isAddingItem ? (
        <ItemForm
          area={area}
          onItemAdded={handleItemAdded}
          onCancel={handleCancelAddItem}
        />
      ) : selectedItem ? (
        <ItemDetail item={selectedItem} onBack={handleBackToList} />
      ) : (
        <ItemList
          area={area}
          onSelectItem={handleSelectItem}
          key={refreshTrigger}
        />
      )}
    </div>
  );
}

export default AreaPage;
