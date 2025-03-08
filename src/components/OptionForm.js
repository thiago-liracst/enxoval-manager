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
    <div className="option-form-container">
      <div className="option-form-header">
        <h3 className="option-form-title">
          Adicionar Nova Opção para{" "}
          <span className="option-form-item-name">{item.nome}</span>
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="option-form">
        <div className="option-form-group">
          <label htmlFor="description" className="option-form-label">
            Descrição da Opção <span className="option-form-required">*</span>
          </label>
          <input
            type="text"
            id="description"
            className="option-form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Modelo X, Marca Y, Cor Z"
            required
          />
        </div>

        <div className="option-form-group">
          <label htmlFor="price" className="option-form-label">
            Preço (R$) <span className="option-form-required">*</span>
          </label>
          <div className="option-form-price-wrapper">
            <span className="option-form-currency">R$</span>
            <input
              type="number"
              id="price"
              className="option-form-input option-form-price-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>

        <div className="option-form-group">
          <label htmlFor="link" className="option-form-label">
            Link do Produto
          </label>
          <input
            type="url"
            id="link"
            className="option-form-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="option-form-buttons">
          <button
            type="button"
            className="option-form-button option-form-cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="option-form-button option-form-submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <span className="option-form-loading">
                <span className="option-form-loading-spinner"></span>
                Salvando...
              </span>
            ) : (
              "Salvar Opção"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OptionForm;
