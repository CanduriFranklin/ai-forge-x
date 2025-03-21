import React, { useState } from 'react';
import axios from 'axios';

function TextGenerator() {
    const [prompt, setPrompt] = useState('');
    const [text, setText] = useState('');
    const [explanation, setExplanation] = useState('');

    const generateText = async () => {
        try {
            const response = await axios.post('https://localhost:5001/TextGeneration/generate-text', { prompt });
            setText(response.data.text);
            setExplanation(response.data.explanation);
        } catch (error) {
            console.error('Error generating text:', error);
        }
    };

    return (
        <div>
            <h2>Generate Text</h2>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt"
            />
            <button onClick={generateText}>Generate</button>
            {text && <p>{text}</p>}
            {explanation && <p>{explanation}</p>}
        </div>
    );
}

export default TextGenerator;