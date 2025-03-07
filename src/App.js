// src/App.js
import React, { useState } from "react";
import AreaSelector from "./components/AreaSelector";
import AreaPage from "./pages/AreaPage";
import "./App.css";

function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  const handleSelectArea = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gerenciador de Enxoval</h1>
      </header>

      <div className="container">
        <AreaSelector onSelectArea={handleSelectArea} />

        {selectedArea && <AreaPage area={selectedArea} />}
      </div>
    </div>
  );
}

export default App;
