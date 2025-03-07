// src/components/AreaSelector.js
import React, { useState, useEffect } from "react";
import { getAreas, addArea, cleanDuplicateAreas } from "../services/firebase";

function AreaSelector({ onSelectArea }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        // Primeiro, limpa áreas duplicadas
        await cleanDuplicateAreas();

        // Depois carrega as áreas
        const areasData = await getAreas();

        // Se não houver áreas, cria as padrões
        if (areasData.length === 0) {
          const defaultAreas = ["Sala", "Cozinha", "Banheiro", "Quarto"];
          const promises = defaultAreas.map((area) => addArea({ nome: area }));

          await Promise.all(promises);
          const newAreasData = await getAreas();
          setAreas(newAreasData);
        } else {
          setAreas(areasData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar áreas:", error);
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleAddArea = async (e) => {
    e.preventDefault();
    if (newAreaName.trim() === "") return;

    // Verifica se já existe uma área com o mesmo nome
    if (
      areas.some(
        (area) => area.nome.toLowerCase() === newAreaName.trim().toLowerCase()
      )
    ) {
      alert("Já existe uma área com este nome!");
      return;
    }

    try {
      await addArea({ nome: newAreaName.trim() });
      setNewAreaName("");
      setIsAdding(false);

      // Recarrega as áreas
      const areasData = await getAreas();
      setAreas(areasData);
    } catch (error) {
      console.error("Erro ao adicionar área:", error);
    }
  };

  if (loading) {
    return <div>Carregando áreas...</div>;
  }

  return (
    <div className="area-selector">
      <h2>Áreas da Casa</h2>

      <div className="areas-list">
        {areas.map((area) => (
          <div
            key={area.id}
            className="area-item"
            onClick={() => onSelectArea(area)}
          >
            {area.nome}
          </div>
        ))}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddArea}>
          <input
            type="text"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Nome da nova área"
            autoFocus
          />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setIsAdding(false)}>
            Cancelar
          </button>
        </form>
      ) : (
        <button onClick={() => setIsAdding(true)}>Adicionar nova área</button>
      )}
    </div>
  );
}

export default AreaSelector;
