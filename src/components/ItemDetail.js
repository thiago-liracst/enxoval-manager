import React, { useState, useEffect } from "react";
import { getOptionsByItem, updateItem } from "../services/firebase";
import OptionList from "./OptionList";
import OptionForm from "./OptionForm";

function ItemDetail({ item, onBack }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({
    nome: item.nome,
    descricao: item.descricao,
    quantidade: item.quantidade,
  });

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
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancelAddOption = () => {
    setIsAddingOption(false);
  };

  const handleOptionStatusChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateItem(item.id, editedItem);
      setIsEditing(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  return (
    <div className="item-detail">
      <div className="item-detail-header">
        <button className="back-button" onClick={onBack}>
          ← Voltar para Lista
        </button>
      </div>

      <div className="item-info">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedItem.nome}
              onChange={(e) =>
                setEditedItem({ ...editedItem, nome: e.target.value })
              }
            />
            <textarea
              value={editedItem.descricao}
              onChange={(e) =>
                setEditedItem({ ...editedItem, descricao: e.target.value })
              }
            />
            <input
              type="number"
              value={editedItem.quantidade}
              onChange={(e) =>
                setEditedItem({ ...editedItem, quantidade: e.target.value })
              }
            />
            <div className="item-actions">
              <button onClick={handleSaveEdit}>Salvar</button>
            </div>
          </>
        ) : (
          <>
            <h2>{item.nome}</h2>
            <p>
              <strong>Descrição:</strong> {item.descricao || "Sem descrição"}
            </p>
            <p>
              <strong>Quantidade:</strong> {item.quantidade}
            </p>
            <div className="item-actions">
              <button onClick={handleEdit}>Editar</button>
            </div>
          </>
        )}
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
