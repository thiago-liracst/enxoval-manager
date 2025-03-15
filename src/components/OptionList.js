import React, { useState } from "react";
import {
  updateOptionStatus,
  updateOption,
  deleteOption,
} from "../services/firebase";

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

  // Função para obter a classe CSS do card baseado no status
  const getCardClass = (status) => {
    switch (status) {
      case "pendente":
        return "option-card--pending";
      case "comprado":
        return "option-card--purchased";
      default:
        return "";
    }
  };

  // Função para obter o texto do status
  const getStatusText = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "pendente":
        return "Selecionado";
      case "comprado":
        return "Comprado";
      default:
        return "Desconhecido";
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
          className={`option-card ${getCardClass(option.status)}`}
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
                    {getStatusText(option.status)}
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
                {option.status === "disponivel" && (
                  <button
                    className="option-card__btn option-card__btn--select"
                    onClick={() => handleStatusChange(option.id, "pendente")}
                  >
                    <span className="option-card__btn-icon">🎯</span>
                    <span className="option-card__btn-text">Selecionar</span>
                  </button>
                )}

                {option.status === "pendente" && (
                  <>
                    <button
                      className="option-card__btn option-card__btn--purchase"
                      onClick={() => handleStatusChange(option.id, "comprado")}
                    >
                      <span className="option-card__btn-icon">✓</span>
                      <span className="option-card__btn-text">
                        Marcar como comprado
                      </span>
                    </button>
                    <button
                      className="option-card__btn option-card__btn--available"
                      onClick={() =>
                        handleStatusChange(option.id, "disponivel")
                      }
                    >
                      <span className="option-card__btn-icon">↩</span>
                      <span className="option-card__btn-text">
                        Desistir da seleção
                      </span>
                    </button>
                  </>
                )}

                {option.status === "comprado" && (
                  <button
                    className="option-card__btn option-card__btn--pending"
                    onClick={() => handleStatusChange(option.id, "pendente")}
                  >
                    <span className="option-card__btn-icon">↩</span>
                    <span className="option-card__btn-text">
                      Desfazer compra
                    </span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <style jsx>{`
        /* Estilos atualizados para o componente */
        .option-card__status-badge--disponivel {
          background-color: #e0e0e0;
          color: #616161;
        }

        .option-card__status-badge--pendente {
          background-color: #fff9c4;
          color: #f57f17;
        }

        .option-card__status-badge--comprado {
          background-color: #c8e6c9;
          color: #2e7d32;
        }

        .option-card--pending {
          border-left: 4px solid #f9a825;
        }

        .option-card__btn--select {
          background-color: #eeeeee;
          color: #424242;
        }

        .option-card__btn--select:hover {
          background-color: #e0e0e0;
        }

        .option-card__btn--available {
          background-color: #e0e0e0;
          color: #616161;
          margin-top: 8px;
        }

        /* Ajusta o layout quando há 2 botões */
        .option-card__footer {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
}

export default OptionList;
