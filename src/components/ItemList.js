// src/components/ItemList.js
import React, { useState, useEffect } from "react";
import { deleteItem, getItemsByArea, getItens } from "../services/firebase";

function ItemList({ area, onSelectItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!area) return;

      try {
        setLoading(true);
        const itemsData = await getItemsByArea(area.id);
        setItems(itemsData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [area]);

  const handleDeleteItem = async (itemId, event) => {
    // Evitar que o clique no botão excluir selecione o item
    event.stopPropagation();

    if (!window.confirm("Tem certeza que deseja excluir este Item?")) return;
    try {
      await deleteItem(itemId);
      setItems(await getItens());
      if (onSelectItem) onSelectItem();
    } catch (error) {
      console.error("Erro ao excluir Item:", error);
    }
  };

  if (loading) {
    return (
      <div className="itemlist-loading">
        <div className="itemlist-loading-spinner"></div>
        <p>Carregando itens...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="itemlist-empty">
        <div className="itemlist-empty-icon">📦</div>
        <p className="itemlist-empty-text">
          Nenhum item cadastrado nesta área.
        </p>
      </div>
    );
  }

  return (
    <div className="itemlist-container">
      <h3 className="itemlist-title">
        <span className="itemlist-title-icon">📋</span>
        <span className="itemlist-title-text">Itens em {area.nome}</span>
      </h3>

      <div className="itemlist-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="itemlist-card"
            onClick={() => onSelectItem(item)}
          >
            <div className="itemlist-card-content">
              <h4 className="itemlist-card-title">{item.nome}</h4>
              <p className="itemlist-card-description">
                {item.descricao || "Sem descrição"}
              </p>

              <div className="itemlist-card-footer">
                <span className="itemlist-card-quantity">
                  <span className="itemlist-card-icon">🔢</span>
                  Qtd: {item.quantidade}
                </span>
                <span className="itemlist-card-options">
                  <span className="itemlist-card-icon">🔣</span>
                  {item.opcoesCount} opções
                </span>
              </div>
            </div>

            <button
              className="itemlist-card-delete"
              onClick={(e) => handleDeleteItem(item.id, e)}
              title="Excluir item"
            >
              <span className="itemlist-delete-icon">🗑</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
