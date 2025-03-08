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
    <div className="item-detail-container">
      <div className="item-detail-header">
        <button className="item-detail-back-button" onClick={onBack}>
          <span className="back-arrow">←</span>
          Voltar para Lista
        </button>
      </div>

      <div className="item-detail-card">
        {isEditing ? (
          <div className="item-edit-form">
            <div className="form-group">
              <label>Nome do Item</label>
              <input
                type="text"
                className="form-input"
                value={editedItem.nome}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, nome: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="form-textarea"
                value={editedItem.descricao}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, descricao: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="number"
                className="form-input"
                value={editedItem.quantidade}
                onChange={(e) =>
                  setEditedItem({ ...editedItem, quantidade: e.target.value })
                }
              />
            </div>

            <div className="item-form-actions">
              <button className="button-primary" onClick={handleSaveEdit}>
                Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          <div className="item-info-view">
            <h2 className="item-title">{item.nome}</h2>
            <div className="item-meta">
              <div className="meta-group">
                <span className="meta-label">Descrição:</span>
                <p className="meta-content">
                  {item.descricao || "Sem descrição"}
                </p>
              </div>
              <div className="meta-group">
                <span className="meta-label">Quantidade:</span>
                <p className="meta-content">{item.quantidade}</p>
              </div>
            </div>
            <button className="button-edit" onClick={handleEdit}>
              Editar Item
            </button>
          </div>
        )}
      </div>

      <div className="item-options-panel">
        <div className="panel-header">
          <h3 className="panel-title">Opções de Compra</h3>
          <button className="button-add-option" onClick={handleAddOption}>
            + Nova Opção
          </button>
        </div>

        <div className="panel-content">
          {isAddingOption ? (
            <OptionForm
              item={item}
              onOptionAdded={handleOptionAdded}
              onCancel={handleCancelAddOption}
            />
          ) : loading ? (
            <div className="loading-message">Carregando opções...</div>
          ) : (
            <OptionList
              options={options}
              onStatusChange={handleOptionStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
