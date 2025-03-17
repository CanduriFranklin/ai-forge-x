import React from 'react';
import './App.css';

function App() {
  const callCppModule = () => {
    // Llamar al módulo C++ (requiere configuración adicional para WebAssembly o Node.js addons)
  };

  const callPythonModule = () => {
    // Llamar al módulo Python (requiere configuración adicional para Pyodide o un servidor backend)
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={callCppModule}>Call C++ Module</button>
        <button onClick={callPythonModule}>Call Python Module</button>
      </header>
    </div>
  );
}

export default App;
