import React, { useState } from 'react';
import axios from 'axios';

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

  return (
    <div>
      <h1>AI Forge Generator</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt"
      />
      <select value={modelType} onChange={(e) => setModelType(e.target.value)}>
        <option value="text">Generate Text</option>
        <option value="image">Generate Image</option>
      </select>
      <button onClick={handleGenerate}>Generate</button>
      <div>
        <h2>Result:</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Generate;
