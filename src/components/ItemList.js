// src/components/ItemList.js
import React, { useState, useEffect } from "react";
import { getItemsByArea } from "../services/firebase";

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

  if (loading) {
    return <div>Carregando itens...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="items-empty">
        <p>Nenhum item cadastrado nesta área.</p>
      </div>
    );
  }

  return (
    <div className="items-list">
      <h3>Itens em {area.nome}</h3>
      <div className="items-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="item-card"
            onClick={() => onSelectItem(item)}
          >
            <h4>{item.nome}</h4>
            <p>{item.descricao || "Sem descrição"}</p>
            <div className="item-footer">
              <span>Qtd: {item.quantidade}</span>
              <span>{item.opcoesCount} opções</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ItemList;
