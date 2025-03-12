import React, { useState } from "react";
import {
  updateOptionStatus,
  updateOption,
  deleteOption,
  getOptions,
} from "../services/firebase";
import { red } from "@mui/material/colors";

function OptionList({ options, onStatusChange }) {
  const [editingOption, setEditingOption] = useState(null);
  const [editedOption, setEditedOption] = useState({
    descricao: "",
    preco: "",
    link: "",
  });

  const handleStatusChange = async (optionId, newStatus) => {
    try {
      await updateOptionStatus(optionId, newStatus);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status. Por favor, tente novamente.");
    }
  };

  const handleEditOption = (option) => {
    setEditingOption(option.id);
    setEditedOption({
      descricao: option.descricao,
      preco: option.preco,
      link: option.link,
    });
  };

  const handleSaveEdit = async (optionId) => {
    try {
      await updateOption(optionId, editedOption);
      setEditingOption(null);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Erro ao atualizar opção:", error);
    }
  };

  const handleDeleteOption = async (optionId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta opção?")) return;
    try {
      await deleteOption(optionId);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Erro ao excluir opção:", error);
    }
  };

  if (options.length === 0) {
    return (
      <div className="option-list__empty">
        <div className="option-list__empty-icon">📋</div>
        <h3>Nenhuma opção cadastrada</h3>
        <p>Adicione opções para comparar preços e características.</p>
      </div>
    );
  }

  return (
    <div className="option-list">
      {options.map((option) => (
        <div
          key={option.id}
          className={`option-card ${
            option.status === "comprado" ? "option-card--purchased" : ""
          }`}
        >
          {editingOption === option.id ? (
            <div className="option-card__edit-mode">
              <div className="option-card__form-group">
                <label>Descrição</label>
                <input
                  type="text"
                  value={editedOption.descricao}
                  onChange={(e) =>
                    setEditedOption({
                      ...editedOption,
                      descricao: e.target.value,
                    })
                  }
                  className="option-card__input"
                />
              </div>

              <div className="option-card__form-group">
                <label>Preço (R$)</label>
                <input
                  type="number"
                  value={editedOption.preco}
                  onChange={(e) =>
                    setEditedOption({
                      ...editedOption,
                      preco: e.target.value,
                    })
                  }
                  className="option-card__input"
                />
              </div>

              <div className="option-card__form-group">
                <label>Link</label>
                <input
                  type="text"
                  value={editedOption.link}
                  onChange={(e) =>
                    setEditedOption({ ...editedOption, link: e.target.value })
                  }
                  className="option-card__input"
                />
              </div>

              <div className="option-card__actions">
                <button
                  className="option-card__btn option-card__btn--save"
                  onClick={() => handleSaveEdit(option.id)}
                >
                  <span className="option-card__btn-icon">💾</span>
                  <span className="option-card__btn-text">Salvar</span>
                </button>
                <button
                  className="option-card__btn option-card__btn--cancel"
                  onClick={() => setEditingOption(null)}
                >
                  <span className="option-card__btn-text">Cancelar</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="option-card__header">
                <div className="option-card__status">
                  <span
                    className={`option-card__status-badge option-card__status-badge--${option.status}`}
                  >
                    {option.status === "pendente" ? "Pendente" : "Comprado"}
                  </span>
                </div>
                <div className="option-card__actions-top">
                  <button
                    className="option-card__btn option-card__btn--icon"
                    onClick={() => handleEditOption(option)}
                    title="Editar"
                  >
                    <span className="option-card__btn-icon">✏️</span>
                  </button>
                  <button
                    className="option-card__btn option-card__btn--icon-delete"
                    onClick={() => handleDeleteOption(option.id)}
                    title="Excluir"
                  >
                    <span className="option-card__btn-icon">🗑</span>
                  </button>
                </div>
              </div>

              <div className="option-card__content">
                <h3 className="option-card__title">{option.descricao}</h3>
                <div className="option-card__price">
                  {option.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>

                {option.link && (
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="option-card__link"
                  >
                    <span className="option-card__link-icon">🔗</span>
                    <span className="option-card__link-text">Ver produto</span>
                  </a>
                )}
              </div>

              <div className="option-card__footer">
                {option.status === "pendente" ? (
                  <button
                    className="option-card__btn option-card__btn--purchase"
                    onClick={() => handleStatusChange(option.id, "comprado")}
                  >
                    <span className="option-card__btn-icon">✓</span>
                    <span className="option-card__btn-text">
                      Marcar como comprado
                    </span>
                  </button>
                ) : (
                  <button
                    className="option-card__btn option-card__btn--pending"
                    onClick={() => handleStatusChange(option.id, "pendente")}
                  >
                    <span className="option-card__btn-icon">↩</span>
                    <span className="option-card__btn-text">
                      Marcar como pendente
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default OptionList;
