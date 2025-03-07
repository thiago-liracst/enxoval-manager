// src/components/OptionList.js
import React from "react";
import { updateOptionStatus } from "../services/firebase";

function OptionList({ options, onStatusChange }) {
  const handleStatusChange = async (optionId, newStatus) => {
    try {
      await updateOptionStatus(optionId, newStatus);
      if (onStatusChange) onStatusChange();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status. Por favor, tente novamente.");
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
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr
              key={option.id}
              className={option.status === "comprado" ? "option-purchased" : ""}
            >
              <td>{option.descricao}</td>
              <td className="price-column">
                {option.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
              <td>
                {option.link ? (
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
                  <button
                    className="status-button purchased-button"
                    onClick={() => handleStatusChange(option.id, "comprado")}
                  >
                    Marcar como comprado
                  </button>
                ) : (
                  <button
                    className="status-button pending-button"
                    onClick={() => handleStatusChange(option.id, "pendente")}
                  >
                    Marcar como pendente
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
