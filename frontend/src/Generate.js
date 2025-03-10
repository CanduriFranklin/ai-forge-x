import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import './Generate.css';

const Generate = () => {
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState('text');
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('/generate', { prompt, model_type: modelType });
      setResult(response.data);
    } catch (error) {
      console.error('Error generating result:', error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(JSON.stringify(result, null, 2), 10, 10);
    doc.save('result.pdf');
  };

  const exportToWord = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/msword' });
    saveAs(blob, 'result.doc');
  };

  const exportToImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillText(JSON.stringify(result, null, 2), 10, 10);
    canvas.toBlob((blob) => {
      saveAs(blob, 'result.png');
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([result]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
    XLSX.writeFile(workbook, 'result.xlsx');
  };

  return (
    <div className="generate-container">
      <h1 className="title">AI Forge Generator</h1>
      <h2 className="subtitle">Generate Text and Images with AI</h2>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
        className="input-prompt"
      />
      <select value={modelType} onChange={(e) => setModelType(e.target.value)} className="select-model">
        <option value="text">Generate Text</option>
        <option value="image">Generate Image</option>
      </select>
      <button onClick={handleGenerate} className="generate-button">Generate</button>
      <div className="result-container">
        <h2>Result:</h2>
        <pre className="result-text">{JSON.stringify(result, null, 2)}</pre>
        <div className="export-buttons">
          <button onClick={exportToPDF}>Export to PDF</button>
          <button onClick={exportToWord}>Export to Word</button>
          <button onClick={exportToImage}>Export to Image</button>
          <button onClick={exportToExcel}>Export to Excel</button>
        </div>
      </div>
    </div>
  );
};

export default Generate;
