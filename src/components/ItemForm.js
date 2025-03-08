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
    <div className="item-form-container">
      <div className="item-form-card">
        <h3 className="item-form-title">Adicionar Novo Item</h3>
        <form onSubmit={handleSubmit} className="item-form">
          <div className="item-form-group">
            <label className="item-form-label" htmlFor="itemName">
              Nome do Item <span className="item-form-required">*</span>
            </label>
            <input
              className="item-form-input"
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Sofá, Toalhas, Geladeira"
              required
            />
          </div>

          <div className="item-form-group">
            <label className="item-form-label" htmlFor="itemDescription">
              Descrição
            </label>
            <textarea
              className="item-form-textarea"
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Descrição ou observações sobre o item"
              rows="3"
            />
          </div>

          <div className="item-form-group">
            <label className="item-form-label" htmlFor="itemQuantity">
              Quantidade
            </label>
            <input
              className="item-form-input item-form-input-number"
              type="number"
              id="itemQuantity"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="item-form-buttons">
            <button
              type="button"
              className="item-form-button item-form-button-cancel"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="item-form-button item-form-button-primary"
              disabled={submitting}
            >
              {submitting ? (
                <span className="item-form-button-loading">
                  <span className="item-form-spinner"></span>
                  Salvando...
                </span>
              ) : (
                "Salvar Item"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ItemForm;
