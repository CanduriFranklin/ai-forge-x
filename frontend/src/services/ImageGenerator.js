import React, { useState } from 'react';
import axios from 'axios';

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [explanation, setExplanation] = useState('');

  const generateImage = async () => {
    try {
      const response = await axios.post('https://localhost:5001/ImageGeneration/generate-image', { prompt });
      setImage(response.data.image);
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  return (
    <div>
      <h2>Generate Image</h2>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter prompt" />
      <button onClick={generateImage}>Generate</button>
      {image && <img src={image} alt="Generated" />}
      {explanation && <p>{explanation}</p>}
    </div>
  );
}

export default ImageGenerator;
