// src/components/ItemDetail.js
import React, { useState, useEffect } from "react";
import { getOptionsByItem } from "../services/firebase";
import OptionList from "./OptionList";
import OptionForm from "./OptionForm";

function ItemDetail({ item, onBack }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const optionsData = await getOptionsByItem(item.id);
        setOptions(optionsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar opções:", error);
        setLoading(false);
      }
    };

    fetchOptions();
  }, [item.id, refreshTrigger]);

  const handleAddOption = () => {
    setIsAddingOption(true);
  };

  const handleOptionAdded = () => {
    setIsAddingOption(false);
    // Atualiza a lista de opções
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelAddOption = () => {
    setIsAddingOption(false);
  };

  const handleOptionStatusChange = () => {
    // Atualiza a lista quando o status de uma opção muda
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="item-detail">
      <div className="item-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Voltar para Lista
        </button>
        <h2>{item.nome}</h2>
      </div>

      <div className="item-info">
        <p>
          <strong>Descrição:</strong> {item.descricao || "Sem descrição"}
        </p>
        <p>
          <strong>Quantidade:</strong> {item.quantidade}
        </p>
      </div>

      <div className="item-options-section">
        <div className="section-header">
          <h3>Opções de Compra</h3>
          <button onClick={handleAddOption}>Adicionar Opção</button>
        </div>

        {isAddingOption ? (
          <OptionForm
            item={item}
            onOptionAdded={handleOptionAdded}
            onCancel={handleCancelAddOption}
          />
        ) : loading ? (
          <div>Carregando opções...</div>
        ) : (
          <OptionList
            options={options}
            onStatusChange={handleOptionStatusChange}
          />
        )}
      </div>
    </div>
  );
}

export default ItemDetail;
