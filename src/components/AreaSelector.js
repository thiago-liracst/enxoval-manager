import React, { useState, useEffect } from "react";
import {
  getAreas,
  addArea,
  cleanDuplicateAreas,
  deleteArea,
} from "../services/firebase";

function AreaSelector({ onSelectArea }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAreaName, setNewAreaName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        await cleanDuplicateAreas();
        const areasData = await getAreas();
        if (areasData.length === 0) {
          const defaultAreas = ["Sala", "Cozinha", "Banheiro", "Quarto"];
          await Promise.all(
            defaultAreas.map((area) => addArea({ nome: area }))
          );
          setAreas(await getAreas());
        } else {
          setAreas(areasData);
        }
      } catch (error) {
        console.error("Erro ao carregar áreas:", error);
      }
      setLoading(false);
    };
    fetchAreas();
  }, []);

  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
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
      setAreas(await getAreas());
    } catch (error) {
      console.error("Erro ao adicionar área:", error);
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta área?")) return;
    try {
      await deleteArea(areaId);
      setAreas(await getAreas());
    } catch (error) {
      console.error("Erro ao excluir área:", error);
    }
  };

  if (loading)
    return <div className="area-selector__loading">Carregando áreas...</div>;

  return (
    <div className="area-selector">
      <h2 className="area-selector__title">Áreas da Casa</h2>
      <div className="area-selector__list">
        {areas.map((area) => (
          <div key={area.id} className="area-selector__item">
            <button
              className="area-selector__item-name"
              onClick={() => onSelectArea(area)}
            >
              {area.nome}
            </button>
            <button
              className="area-selector__delete-btn"
              onClick={() => handleDeleteArea(area.id)}
              aria-label="Excluir área"
            >
              <span className="area-selector__delete-icon">🗑</span>
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <form className="area-selector__form" onSubmit={handleAddArea}>
          <input
            type="text"
            className="area-selector__input"
            value={newAreaName}
            onChange={(e) => setNewAreaName(e.target.value)}
            placeholder="Nome da nova área"
            autoFocus
          />
          <div className="area-selector__form-buttons">
            <button type="submit" className="area-selector__submit-btn">
              Salvar
            </button>
            <button
              type="button"
              className="area-selector__cancel-btn"
              onClick={() => setIsAdding(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          className="area-selector__add-btn"
          onClick={() => setIsAdding(true)}
        >
          <span className="area-selector__add-icon">+</span> Adicionar nova área
        </button>
      )}
    </div>
  );
}

export default AreaSelector;
