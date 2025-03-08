import React, { useState } from "react";
import {
  updateOptionStatus,
  updateOption,
  deleteOption,
  getOptions,
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
      setEditedOption(await getOptions());
      //setEditingOption(null);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Erro ao excluir opção:", error);
    }
  };

  if (options.length === 0) {
    return (
      <div className="options-empty">
        <p>Nenhuma opção cadastrada para este item.</p>
        <p>Adicione opções para comparar preços e características.</p>
      </div>
    );
  }

  return (
    <div className="options-table-container">
      <table className="options-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Link</th>
            <th>Status</th>
            <th>Ações</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr
              key={option.id}
              className={option.status === "comprado" ? "option-purchased" : ""}
            >
              <td>
                {editingOption === option.id ? (
                  <input
                    type="text"
                    value={editedOption.descricao}
                    onChange={(e) =>
                      setEditedOption({
                        ...editedOption,
                        descricao: e.target.value,
                      })
                    }
                  />
                ) : (
                  option.descricao
                )}
              </td>
              <td className="price-column">
                {editingOption === option.id ? (
                  <input
                    type="number"
                    value={editedOption.preco}
                    onChange={(e) =>
                      setEditedOption({
                        ...editedOption,
                        preco: e.target.value,
                      })
                    }
                  />
                ) : (
                  option.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                )}
              </td>
              <td>
                {editingOption === option.id ? (
                  <input
                    type="text"
                    value={editedOption.link}
                    onChange={(e) =>
                      setEditedOption({ ...editedOption, link: e.target.value })
                    }
                  />
                ) : option.link ? (
                  <a
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="option-link"
                  >
                    Ver produto
                  </a>
                ) : (
                  <span>-</span>
                )}
              </td>
              <td>
                <span className={`status-badge status-${option.status}`}>
                  {option.status === "pendente" ? "Pendente" : "Comprado"}
                </span>
              </td>
              <td>
                {option.status === "pendente" ? (
                  <>
                    <button
                      className="status-button purchased-button"
                      onClick={() => handleStatusChange(option.id, "comprado")}
                    >
                      Marcar como comprado
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      🗑
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="status-button pending-button"
                      onClick={() => handleStatusChange(option.id, "pendente")}
                    >
                      Marcar como pendente
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteOption(option.id)}
                    >
                      🗑
                    </button>
                  </>
                )}
              </td>
              <td>
                {editingOption === option.id ? (
                  <button
                    className="save-btn"
                    onClick={() => handleSaveEdit(option.id)}
                  >
                    💾
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => handleEditOption(option)}
                  >
                    ✏️
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OptionList;
