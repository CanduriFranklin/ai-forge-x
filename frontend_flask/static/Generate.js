// Animación de Carga (Loading)
function showLoadingAnimation() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-animation';
    document.body.appendChild(loadingElement);

    // Simular una carga de 3 segundos
    setTimeout(() => {
        loadingElement.remove();
        showCompletionAnimation();
    }, 3000);
}

// Animación de Finalización (Completion)
function showCompletionAnimation() {
    const completionElement = document.createElement('div');
    completionElement.className = 'completion-animation';
    document.body.appendChild(completionElement);

    // Eliminar la animación después de 2 segundos
    setTimeout(() => {
        completionElement.remove();
    }, 2000);
}

// Efecto Hover para Tarjetas y Botones
function addHoverEffects() {
    const cards = document.querySelectorAll('.model-card');
    const buttons = document.querySelectorAll('button');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
            card.style.borderColor = '#6a11cb';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.borderColor = '#ddd';
        });
    });

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Feedback Visual (Notificaciones)
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Deslizar desde la parte superior
    setTimeout(() => {
        notification.style.top = '20px';
    }, 10);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Transiciones entre Pestañas
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    const activeTab = document.getElementById(tabId);
    activeTab.classList.add('active');

    // Animación de deslizamiento
    activeTab.style.opacity = '0';
    setTimeout(() => {
        activeTab.style.opacity = '1';
    }, 10);
}

document.addEventListener('DOMContentLoaded', function() {
    addHoverEffects();

    // Function to open tabs
    function openTab(tabName) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.remove('active');
        }
        document.getElementById(tabName).classList.add('active');
    }

    // Set default tab
    openTab('welcome');

    // Registration form submission event listener
    document.getElementById('registration-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Registering user:', username, email);
        // Add code to handle registration
        // Redirect to playground after registration
        openTab('playground');
    });

    // Export as CSV button event listener
    document.getElementById('export-csv').addEventListener('click', function() {
        console.log('Exporting data as CSV');
        // Add code to export data as CSV
    });

    // Export as JSON button event listener
    document.getElementById('export-json').addEventListener('click', function() {
        console.log('Exporting data as JSON');
        // Add code to export data as JSON
    });

    // Generate Image button event listener
    document.getElementById('generate-image').addEventListener('click', function() {
        console.log('Generating image');
        // Add code to generate image
        fetch('/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: 'Generate an image' })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('image-result').innerHTML = `<img src="data:image/png;base64,${data.image}" alt="Generated Image">`;
        })
        .catch(error => console.error('Error:', error));
    });

    // Generate Text button event listener
    document.getElementById('generate-text').addEventListener('click', function() {
        console.log('Generating text');
        // Add code to generate text
        fetch('/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: 'Generate some text' })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('text-result').innerHTML = `<p>${data.text}</p>`;
        })
        .catch(error => console.error('Error:', error));
    });

    // Execute Query button event listener
    document.getElementById('execute-query').addEventListener('click', function() {
        const query = document.getElementById('query-input').value;
        console.log('Executing query:', query);
        fetch('/execute-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: query })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('query-result').innerHTML = `
                <p>Data: ${data.data}</p>
                <p>Explanation: ${data.explanation}</p>
                <p>Index: ${data.index}</p>
                <p>Confidence Score: ${data.confidence_score}</p>
            `;
        })
        .catch(error => console.error('Error:', error));
    });

    // Ejemplo de uso de animaciones
    const generateButton = document.querySelector('.generate-button');
    if (generateButton) {
        generateButton.addEventListener('click', () => {
            showLoadingAnimation();
        });
    }

    // Ejemplo de notificación
    const registerButton = document.querySelector('.register-button');
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            showNotification('Registro exitoso!', 'success');
        });
    }

    // Ejemplo de cambio de pestaña
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
});