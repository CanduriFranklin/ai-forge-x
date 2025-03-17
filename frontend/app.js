// ...existing code...

import { Button } from '@mui/material';

function showLoading(isLoading) {
    const loadingElement = document.getElementById('loading');
    if (isLoading) {
        loadingElement.style.display = 'block';
    } else {
        loadingElement.style.display = 'none';
    }
}

// Asegúrate de llamar a showLoading en los lugares adecuados
document.getElementById('generateTextButton').addEventListener('click', () => {
    showLoading(true);
    fetch('/generate-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: document.getElementById('textPrompt').value,
            max_tokens: 150
        })
    }).then(response => response.json())
      .then(data => {
          document.getElementById('result').innerText = data.text;
          showLoading(false);
      }).catch(error => {
          console.error('Error:', error);
          showLoading(false);
      });
});

// Asegúrate de llamar a showLoading en el evento del botón de generación de imágenes
document.getElementById('generateImageButton').addEventListener('click', () => {
    showLoading(true);
    fetch('/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: document.getElementById('imagePrompt').value,
            size: '512x512'
        })
    }).then(response => response.json())
      .then(data => {
          document.getElementById('imageResult').src = data.imageUrl;
          showLoading(false);
      }).catch(error => {
          console.error('Error:', error);
          showLoading(false);
      });
});

// ...existing code...