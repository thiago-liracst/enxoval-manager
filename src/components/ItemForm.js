// src/components/ItemForm.js
import React, { useState } from "react";
import { addItem } from "../services/firebase";

function ItemForm({ area, onItemAdded, onCancel }) {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (itemName.trim() === "") {
      alert("Por favor, informe o nome do item.");
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

      setSubmitting(false);

      // Notificar que o item foi adicionado
      if (onItemAdded) onItemAdded();
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      setSubmitting(false);
      alert("Erro ao adicionar item. Por favor, tente novamente.");
    }
  };

  return (
    <div className="item-form">
      <h3>Adicionar Novo Item</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Nome do Item *</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Ex: Sofá, Toalhas, Geladeira"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemDescription">Descrição</label>
          <textarea
            id="itemDescription"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Descrição ou observações sobre o item"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemQuantity">Quantidade</label>
          <input
            type="number"
            id="itemQuantity"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar Item"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ItemForm;
