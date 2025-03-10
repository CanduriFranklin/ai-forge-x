import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [explanation, setExplanation] = useState('');

  const handleGenerateImage = async () => {
    const response = await axios.post('/generate-image', { prompt });
    setImage(response.data.image);
    setExplanation(response.data.explanation);
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt"
      />
      <button onClick={handleGenerateImage}>Generate Image</button>
      {image && <img src={image} alt="Generated" />}
      {explanation && <p>{explanation}</p>}
    </div>
  );
}

export default App;
