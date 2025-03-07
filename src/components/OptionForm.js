// src/components/OptionForm.js
import React, { useState } from "react";
import { addOption } from "../services/firebase";

function OptionForm({ item, onOptionAdded, onCancel }) {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim() === "") {
      alert("Por favor, informe a descrição da opção.");
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      alert("Por favor, informe um preço válido.");
      return;
    }

    try {
      setSubmitting(true);

      const newOption = {
        itemId: item.id,
        descricao: description.trim(),
        preco: parseFloat(price),
        link: link.trim(),
        opcoesCount: item.opcoesCount || 0,
      };

      await addOption(newOption);

      // Limpar formulário
      setDescription("");
      setPrice("");
      setLink("");

      setSubmitting(false);

      // Notificar que a opção foi adicionada
      if (onOptionAdded) onOptionAdded();
    } catch (error) {
      console.error("Erro ao adicionar opção:", error);
      setSubmitting(false);
      alert("Erro ao adicionar opção. Por favor, tente novamente.");
    }
  };

  return (
    <div className="option-form">
      <h3>Adicionar Nova Opção para {item.nome}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Descrição da Opção *</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Modelo X, Marca Y, Cor Z"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Preço (R$) *</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link do Produto</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={submitting}>
            {submitting ? "Salvando..." : "Salvar Opção"}
          </button>
          <button type="button" class="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default OptionForm;
