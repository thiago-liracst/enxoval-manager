// src/App.js
import React, { useState } from "react";
import AreaSelector from "./components/AreaSelector";
import DashboardMetrics from "./components/DashboardMetrics";
import AreaPage from "./pages/AreaPage";
import "./App.css";
import { HiHome } from "react-icons/hi";

function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  const handleSelectArea = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{<HiHome />} Nossa Casa Nova</h1>
      </header>

      <div>
        <DashboardMetrics />
      </div>

      <div className="container">
        <AreaSelector onSelectArea={handleSelectArea} />

        {selectedArea && <AreaPage area={selectedArea} />}
      </div>
    </div>
  );
}

export default App;
