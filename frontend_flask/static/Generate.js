// Animación de Carga (Loading)
function showLoadingAnimation() {
    const existing = document.querySelector('.loading-animation');
    if (existing) existing.remove();

    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-animation';
    document.body.appendChild(loadingElement);
    return loadingElement;
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
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.top = '20px';
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.top = '-100px';
        setTimeout(() => notification.remove(), 300);
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

// Función para mostrar el progreso de tokens disponibles
function showTokenProgress(tokens) {
    const tokenProgress = document.getElementById('token-progress');
    if (tokenProgress) {
        tokenProgress.value = tokens;
        tokenProgress.innerText = `${tokens} tokens disponibles`;
        if (tokens < 20) {
            tokenProgress.classList.add('low-tokens');
        } else {
            tokenProgress.classList.remove('low-tokens');
        }
    }
}

// Función para mostrar el saldo disponible
function showBalanceProgress(balance) {
    const balanceProgress = document.getElementById('balance-progress');
    if (balanceProgress) {
        balanceProgress.value = balance;
        balanceProgress.innerText = `$${balance} disponibles`;
        if (balance < 10) {
            balanceProgress.classList.add('low-balance');
        } else {
            balanceProgress.classList.remove('low-balance');
        }
    }
}

// Llamar a las funciones de progreso al cargar la página
window.addEventListener('load', () => {
    showTokenProgress(100); // Ejemplo de tokens disponibles
    showBalanceProgress(50); // Ejemplo de saldo disponible
});

// Evitar que la aplicación se quede guindada
function preventAppHang() {
    const loadingAnimation = document.getElementById('loading-animation');
    if (loadingAnimation) {
        setTimeout(() => {
            loadingAnimation.style.display = 'none';
            showNotification('La solicitud está tardando más de lo esperado. Por favor, inténtelo de nuevo más tarde.', 'error');
        }, 10000); // 10 segundos
    }
}

// Llamar a la función para evitar que la aplicación se quede guindada
preventAppHang();

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    window.switchTab = function(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });

        // Update tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active');
            
            // Animación de deslizamiento
            activeTab.style.opacity = '0';
            setTimeout(() => {
                activeTab.style.opacity = '1';
            }, 10);
        }
    }

    // Add click listeners to all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabId = e.target.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Handle "Start Creating" button
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            switchTab('models');
        });
    }

    // Loading animation handling
    function showLoading() {
        const loader = document.getElementById('loading-animation');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    function hideLoading() {
        const loader = document.getElementById('loading-animation');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // Notification handling
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.top = '20px';
        }, 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.top = '-100px';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Toggle 3D options based on generation mode
    const staticModeRadio = document.getElementById('mode-static');
    const threeDModeRadio = document.getElementById('mode-3d');
    const threeDOptions = document.getElementById('3d-options');

    if (staticModeRadio && threeDModeRadio && threeDOptions) {
        staticModeRadio.addEventListener('change', () => {
            threeDOptions.style.display = 'none';
        });

        threeDModeRadio.addEventListener('change', () => {
            threeDOptions.style.display = 'block';
        });
    }

    // 3D Model handling - Initialize variables
    let scene, camera, renderer, controls, model;
    const modelContainer = document.getElementById('model-container');
    const canvasContainer = document.getElementById('3d-canvas');
    const modelInfoPanel = document.getElementById('model-info');

    // Initialize Three.js scene
    function initThreeJS() {
        if (typeof THREE === 'undefined') {
            console.error('THREE.js is not loaded');
            showNotification('Error: THREE.js library not loaded', 'error');
            return false;
        }

        console.log('Initializing Three.js');
        try {
            // Create scene
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf0f0f0);

            // Create camera
            camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
            camera.position.z = 5;

            // Create renderer
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            canvasContainer.appendChild(renderer.domElement);

            // Add orbit controls if available
            if (typeof THREE.OrbitControls !== 'undefined') {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
            } else {
                console.warn('OrbitControls not available');
            }
            
            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Start animation loop
            animate();

            // Handle window resize
            window.addEventListener('resize', () => {
                if (canvasContainer && renderer && camera) {
                    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
                }
            });
            
            console.log('Three.js initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Three.js:', error);
            showNotification('Error initializing 3D viewer', 'error');
            return false;
        }
    }

    function animate() {
        if (renderer && scene && camera) {
            requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
    }

    function clearScene() {
        if (model && scene) {
            scene.remove(model);
            model = null;
        }
    }

    // Generate geometric model
    function generateGeometricModel(shape) {
        clearScene();
        
        console.log('Generating geometric model:', shape);
        let geometry;
        let info = {
            name: shape,
            properties: {}
        };
        
        switch(shape.toLowerCase()) {
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(2);
                info.properties = {
                    'Faces': '12 regular pentagons',
                    'Vertices': '20',
                    'Edges': '30',
                    'Dihedral angle': '116.57 degrees'
                };
                break;
            case 'cube':
                geometry = new THREE.BoxGeometry(3, 3, 3);
                info.properties = {
                    'Faces': '6 squares',
                    'Vertices': '8',
                    'Edges': '12',
                    'Dihedral angle': '90 degrees'
                };
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(2.5);
                info.properties = {
                    'Faces': '4 equilateral triangles',
                    'Vertices': '4',
                    'Edges': '6',
                    'Dihedral angle': '70.53 degrees'
                };
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(2);
                info.properties = {
                    'Faces': '20 equilateral triangles',
                    'Vertices': '12',
                    'Edges': '30',
                    'Dihedral angle': '138.19 degrees'
                };
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(2);
                info.properties = {
                    'Faces': '8 equilateral triangles',
                    'Vertices': '6',
                    'Edges': '12',
                    'Dihedral angle': '109.47 degrees'
                };
                break;
            default:
                geometry = new THREE.SphereGeometry(2, 32, 32);
                info.name = 'Sphere';
                info.properties = {
                    'Surface area': '4πr²',
                    'Volume': '(4/3)πr³',
                    'Perfect symmetry': 'Infinite rotational axes'
                };
        }
        
        const material = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            metalness: 0.2,
            roughness: 0.5,
            transparent: true,
            opacity: 0.9,
            wireframe: false
        });
        
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
        
        // Add wireframe
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
        );
        model.add(wireframe);
        
        // Create and display model info
        updateModelInfo(info);
        
        // Reset camera position
        camera.position.set(0, 0, 5);
        controls.update();
        console.log('Geometric model generated successfully');
    }

    // Generate anatomical model
    function generateAnatomicalModel(organ) {
        clearScene();
        
        console.log('Generating anatomical model:', organ);
        // Placeholder - in a real application, this would load detailed anatomical models
        let geometry;
        let info = {
            name: organ,
            properties: {}
        };
        
        switch(organ.toLowerCase()) {
            case 'heart':
                geometry = new THREE.SphereGeometry(2, 32, 32);
                info.properties = {
                    'Weight': '250-350 grams',
                    'Size': 'Approximately the size of a fist',
                    'Pumps': 'About 2,000 gallons of blood daily',
                    'Beats per minute': '60-100 (avg. resting)'
                };
                break;
            case 'kidney':
                // Simplified kidney shape
                geometry = new THREE.SphereGeometry(2, 32, 16);
                // Flatten it a bit
                for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
                    geometry.attributes.position.array[i] *= 1.5;
                    geometry.attributes.position.array[i+1] *= 0.8;
                    geometry.attributes.position.array[i+2] *= 1;
                }
                geometry.attributes.position.needsUpdate = true;
                
                info.properties = {
                    'Weight': '120-170 grams',
                    'Length': '10-12 cm',
                    'Width': '5-7 cm',
                    'Thickness': '3 cm',
                    'Function': 'Filters 120-150 quarts of blood daily'
                };
                break;
            case 'brain':
                geometry = new THREE.SphereGeometry(2, 32, 32);
                
                info.properties = {
                    'Weight': '1300-1400 grams',
                    'Neurons': 'About 86 billion',
                    'Cerebral cortex': 'Approx. 16 billion neurons',
                    'Oxygen consumption': '20% of body\'s oxygen'
                };
                break;
            default:
                geometry = new THREE.SphereGeometry(2, 32, 32);
                info.name = 'Generic Organ';
                info.properties = {
                    'Note': 'This is a placeholder model. Specific organ details would be shown here.'
                };
        }
        
        const material = new THREE.MeshStandardMaterial({
            color: 0xe74c3c,
            metalness: 0.1,
            roughness: 0.6,
            transparent: true,
            opacity: 0.9
        });
        
        model = new THREE.Mesh(geometry, material);
        scene.add(model);
        
        // Create and display model info
        updateModelInfo(info);
        
        // Reset camera position
        camera.position.set(0, 0, 5);
        controls.update();
        console.log('Anatomical model generated successfully');
    }

    function updateModelInfo(info) {
        let html = `<h4>${info.name}</h4>`;
        
        html += '<div class="properties">';
        for (const [key, value] of Object.entries(info.properties)) {
            html += `
                <div class="measurement">
                    <span class="measurement-label">${key}:</span>
                    <span class="measurement-value">${value}</span>
                </div>
            `;
        }
        html += '</div>';
        
        if (modelInfoPanel) {
            modelInfoPanel.innerHTML = html;
        }
    }

    // Image Generation with customization parameters
    const generateImageBtn = document.getElementById('generate-image-btn');
    const imagePrompt = document.getElementById('image-prompt');
    const imageResult = document.getElementById('image-result');

    if (generateImageBtn && imagePrompt && imageResult) {
        generateImageBtn.addEventListener('click', async () => {
            const prompt = imagePrompt.value.trim();
            if (!prompt) {
                showNotification('Please enter a description for the image', 'error');
                return;
            }

            // Check if 3D mode is selected
            const is3DMode = document.getElementById('mode-3d')?.checked || false;
            
            // Mostrar el contenedor del modelo 3D cuando se selecciona el modo "Interactive 3D Model"
            const modelContainer = document.getElementById('model-container');
            const canvasContainer = document.getElementById('3d-canvas');
            const modelInfoPanel = document.getElementById('model-info');

            if (is3DMode && modelContainer && canvasContainer) {
                modelContainer.style.display = 'block';
                console.log('Model container is now visible');
                imageResult.style.display = 'none';

                // Inicializar Three.js si no se ha hecho ya
                const initialized = !renderer && initThreeJS();
                if (!initialized && !renderer) {
                    throw new Error('Could not initialize 3D viewer');
                }

                // Generar el modelo adecuado según el tipo y el prompt
                if (modelType === 'geometric') {
                    // Extraer la forma del prompt
                    const shapeKeywords = ['cube', 'dodecahedron', 'tetrahedron', 'icosahedron', 'octahedron', 'sphere'];
                    const promptLower = prompt.toLowerCase();

                    let selectedShape = 'cube'; // Por defecto
                    for (const shape of shapeKeywords) {
                        if (promptLower.includes(shape)) {
                            selectedShape = shape;
                            break;
                        }
                    }

                    generateGeometricModel(selectedShape);
                    showNotification(`Generated interactive ${selectedShape} model`, 'success');
                } else if (modelType === 'anatomical') {
                    // Extraer el órgano del prompt
                    const organKeywords = ['heart', 'brain', 'kidney', 'liver', 'lung'];
                    const promptLower = prompt.toLowerCase();

                    let selectedOrgan = 'heart'; // Por defecto
                    for (const organ of organKeywords) {
                        if (promptLower.includes(organ)) {
                            selectedOrgan = organ;
                            break;
                        }
                    }

                    generateAnatomicalModel(selectedOrgan);
                    showNotification(`Generated interactive ${selectedOrgan} model`, 'success');
                } else {
                    // La estructura molecular se manejaría aquí
                    showNotification('Molecular structure visualization coming soon', 'info');
                }
            } else {
                // Regular image generation mode
                // Hide model container if it exists and show image result
                if (modelContainer) modelContainer.style.display = 'none';
                imageResult.style.display = 'block';
                
                // Get customization values
                const width = parseInt(document.getElementById('image-width')?.value || 512);
                const height = parseInt(document.getElementById('image-height')?.value || 512);
                const steps = parseInt(document.getElementById('inference-steps')?.value || 30);
                const negativePrompt = document.getElementById('negative-prompt')?.value?.trim() || '';
                const seed = parseInt(document.getElementById('generation-seed')?.value || -1);

                showLoading();
                try {
                    const response = await fetch('http://localhost:5001/generate-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            prompt,
                            width,
                            height,
                            steps,
                            negative_prompt: negativePrompt,
                            seed
                        })
                    });

                    const data = await response.json();
                    
                    if (data.error) {
                        showNotification(data.error, 'error');
                        console.error('API Error:', data.error);
                    } else {
                        if (data.image) {
                            // Create HTML for the detailed explanation
                            const explanation = data.explanation;
                            let explanationHTML = '';
                            
                            if (explanation) {
                                explanationHTML = `
                                    <div class="explanation-container">
                                        <div class="explanation-title">Generation Process Explanation</div>
                                        
                                        <div class="explanation-section">
                                            <h5>Process</h5>
                                            <p>${explanation.process}</p>
                                        </div>
                                        
                                        <div class="explanation-section">
                                            <h5>Parameters Used</h5>
                                            <div class="parameters-list">`;
                                
                                for (const [key, value] of Object.entries(explanation.parameters)) {
                                    explanationHTML += `
                                        <div class="parameter">
                                            <span class="parameter-label">${key}:</span> 
                                            <span class="parameter-value">${value}</span>
                                        </div>`;
                                }
                                
                                explanationHTML += `
                                            </div>
                                        </div>
                                        
                                        <div class="explanation-section">
                                            <h5>Key Elements</h5>
                                            <p>${explanation.key_elements}</p>
                                        </div>
                                        
                                        <div class="explanation-section">
                                            <h5>Interpretation</h5>
                                            <p>${explanation.interpretation}</p>
                                        </div>
                                        
                                        <div class="suggestion-box">
                                            ${explanation.suggestions}
                                        </div>
                                    </div>
                                `;
                            }

                            // Display the image and explanation
                            imageResult.innerHTML = `
                                <img src="${data.image}" alt="Generated Image" onerror="this.onerror=null; this.src=''; showNotification('Error loading image', 'error');">
                                <div class="image-info">
                                    <p class="prompt-text"><strong>Prompt:</strong> ${prompt}</p>
                                    ${negativePrompt ? `<p class="negative-prompt-text"><strong>Negative Prompt:</strong> ${negativePrompt}</p>` : ''}
                                </div>
                                ${explanationHTML}
                            `;
                            showNotification('Image generated successfully', 'success');
                        } else {
                            showNotification('No image URL received from API', 'error');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showNotification('Error generating image: ' + (error.message || 'Unknown error'), 'error');
                } finally {
                    hideLoading();
                }
            }
        });
    }

    // Text Generation
    const generateTextBtn = document.getElementById('generate-text-btn');
    const textPrompt = document.getElementById('text-prompt');
    const textResult = document.getElementById('text-result');

    if (generateTextBtn && textPrompt && textResult) {
        generateTextBtn.addEventListener('click', async () => {
            const prompt = textPrompt.value.trim();
            if (!prompt) {
                showNotification('Please enter a text prompt', 'error');
                return;
            }

            // Get customization values
            const temperature = parseFloat(document.getElementById('text-temperature')?.value || 0.7);
            const maxLength = parseInt(document.getElementById('text-max-length')?.value || 1024);

            showLoading();
            try {
                const response = await fetch('http://localhost:5000/generate-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        prompt,
                        temperature,
                        max_tokens: maxLength
                    })
                });

                const data = await response.json();
                
                if (data.error) {
                    showNotification(data.error, 'error');
                } else {
                    textResult.innerHTML = `
                        <div class="text-content">
                            <p class="prompt-text"><strong>Prompt:</strong> ${prompt}</p>
                            <div class="generated-text">${data.text || ''}</div>
                            <div class="reasoning-section">
                                <div class="reasoning-title">Generation Process Explanation</div>
                                <p>Text generated using LLaMA 3.1 70B model with temperature ${temperature}. The model processed your prompt and generated a response based on patterns learned during training.</p>
                                <p>For more detailed explanations of specific statements, click on any part of the generated text.</p>
                            </div>
                        </div>
                    `;
                    showNotification('Text generated successfully!', 'success');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error generating text', 'error');
            } finally {
                hideLoading();
            }
        });
    }

    // Export functionality
    document.querySelectorAll('.export-button').forEach(button => {
        button.addEventListener('click', () => {
            showNotification('Export feature coming soon!', 'info');
        });
    });

    // Model control buttons (if they exist)
    document.getElementById('rotate-left')?.addEventListener('click', () => {
        if (model) {
            model.rotation.y -= Math.PI / 4;
        }
    });
    
    document.getElementById('rotate-right')?.addEventListener('click', () => {
        if (model) {
            model.rotation.y += Math.PI / 4;
        }
    });
    
    document.getElementById('zoom-in')?.addEventListener('click', () => {
        if (camera) {
            camera.position.z *= 0.8;
        }
    });
    
    document.getElementById('zoom-out')?.addEventListener('click', () => {
        if (camera) {
            camera.position.z *= 1.2;
        }
    });
    
    document.getElementById('reset-view')?.addEventListener('click', () => {
        if (camera && controls) {
            camera.position.set(0, 0, 5);
            controls.reset();
        }
    });

    // Add hover effects for better UI interaction
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

    // Initialize UI enhancements
    addHoverEffects();

    // Funciones mejoradas para monitoreo de recursos
    function updateTokenProgress(used, total) {
        const tokenProgressBar = document.getElementById('token-progress-bar');
        const tokenCount = document.getElementById('token-count');
        const tokenContainer = document.getElementById('token-progress-container');
        
        if (tokenProgressBar && tokenCount) {
            const percentage = ((total - used) / total) * 100;
            tokenProgressBar.style.width = `${percentage}%`;
            tokenCount.textContent = `${total - used}/${total}`;
            
            // Cambiar color cuando esté bajo
            if (percentage < 20) {
                tokenContainer.classList.add('low-tokens');
            } else {
                tokenContainer.classList.remove('low-tokens');
            }
        }
    }

    function updateBalanceProgress(current, max) {
        const balanceProgressBar = document.getElementById('balance-progress-bar');
        const balanceCount = document.getElementById('balance-count');
        const balanceContainer = document.getElementById('balance-progress-container');
        
        if (balanceProgressBar && balanceCount) {
            const percentage = (current / max) * 100;
            balanceProgressBar.style.width = `${percentage}%`;
            balanceCount.textContent = `$${current.toFixed(2)}`;
            
            // Cambiar color cuando esté bajo
            if (percentage < 20) {
                balanceContainer.classList.add('low-balance');
            } else {
                balanceContainer.classList.remove('low-balance');
            }
        }
    }

    function updateRequestCount(used, total) {
        const requestsCount = document.getElementById('requests-count');
        if (requestsCount) {
            requestsCount.textContent = `${used}/${total}`;
        }
    }

    function updateLastGenerationTime() {
        const lastGenTime = document.getElementById('last-generation-time');
        if (lastGenTime) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            lastGenTime.textContent = timeString;
        }
    }

    // Simular el consumo de tokens y saldo en cada generación
    function simulateResourceConsumption(imageGeneration = true) {
        // Obtener los valores actuales
        const tokenCountEl = document.getElementById('token-count');
        const balanceCountEl = document.getElementById('balance-count');
        const requestsCountEl = document.getElementById('requests-count');
        
        if (!tokenCountEl || !balanceCountEl || !requestsCountEl) return;
        
        // Parsear los valores actuales
        const tokenText = tokenCountEl.textContent;
        const [currentTokens, totalTokens] = tokenText.split('/').map(Number);
        
        const balanceText = balanceCountEl.textContent;
        const currentBalance = parseFloat(balanceText.replace('$', ''));
        
        const requestsText = requestsCountEl.textContent;
        const [currentRequests, totalRequests] = requestsText.split('/').map(Number);
        
        // Simular consumo
        const tokensUsed = imageGeneration ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 50) + 20;
        const balanceUsed = imageGeneration ? (Math.random() * 2) + 1 : (Math.random() * 0.5) + 0.5;
        
        // Actualizar los indicadores
        updateTokenProgress(tokensUsed, totalTokens);
        updateBalanceProgress(Math.max(0, currentBalance - balanceUsed), 100);
        updateRequestCount(currentRequests + 1, totalRequests);
        updateLastGenerationTime();
    }

    // Inicializar los indicadores de recursos
    updateTokenProgress(0, 100);
    updateBalanceProgress(50, 100);
    updateRequestCount(0, 100);
    
    // Actualizar el código del botón de generar imagen para añadir la simulación de consumo
    if (generateImageBtn) {
        const originalClickHandler = generateImageBtn.onclick;
        generateImageBtn.addEventListener('click', function() {
            // Simular consumo de recursos
            simulateResourceConsumption(true);
        });
    }
    
    // Actualizar el código del botón de generar texto para añadir la simulación de consumo
    if (generateTextBtn) {
        const originalClickHandler = generateTextBtn.onclick;
        generateTextBtn.addEventListener('click', function() {
            // Simular consumo de recursos
            simulateResourceConsumption(false);
        });
    }
});

const examplePrompts = {
    image: [
        "A detailed illustration of the human heart with labels for each part.",
        "A 3D model of a kidney showing its internal structure.",
        "An anatomical diagram of the brain highlighting the different lobes.",
        "A serene mountain landscape at sunset, with a lake reflection.",
        "A futuristic city skyline at night with flying cars and neon lights."
    ],
    text: [
        "Write a short story about a doctor who discovers a new medical breakthrough.",
        "Describe the daily routine of a nurse working in a busy hospital.",
        "Explain the process of organ transplantation and its importance.",
        "Write an article about the benefits of regular exercise for mental health.",
        "Describe the impact of technology on modern healthcare."
    ]
};

// Function to display example prompts
function displayExamplePrompts() {
    console.log("Example Image Prompts:");
    examplePrompts.image.forEach(prompt => console.log(`- ${prompt}`));

    console.log("\nExample Text Prompts:");
    examplePrompts.text.forEach(prompt => console.log(`- ${prompt}`));
}

// Call the function to display example prompts
window.displayExamplePrompts = displayExamplePrompts;

window.switchTab = switchTab;

async function generateImage() {
    const prompt = document.getElementById('image-prompt').value;
    const width = document.getElementById('image-width').value;
    const height = document.getElementById('image-height').value;
    const steps = document.getElementById('inference-steps').value;
    const negativePrompt = document.getElementById('negative-prompt').value;
    const seed = document.getElementById('generation-seed').value;

    const requestData = {
        prompt: prompt,
        width: parseInt(width),
        height: parseInt(height),
        steps: parseInt(steps),
        negative_prompt: negativePrompt,
        seed: parseInt(seed)
    };

    try {
        const response = await fetch('/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch');
        }

        const data = await response.json();
        const imageResult = document.getElementById('image-result');
        imageResult.innerHTML = `<img src="data:image/webp;base64,${data.image}" alt="Generated Image">`;
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Error generating image: ' + error.message);
    }
}

document.getElementById('generate-image-btn').addEventListener('click', generateImage);

async function generateText() {
    const prompt = document.getElementById('text-prompt').value;
    const temperature = parseFloat(document.getElementById('text-temperature').value);
    const maxLength = parseInt(document.getElementById('text-max-length').value);

    const requestData = {
        prompt: prompt,
        temperature: temperature,
        max_tokens: maxLength
    };

    try {
        const response = await fetch('/generate-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch');
        }

        const data = await response.json();
        const textResult = document.getElementById('text-result');
        textResult.innerHTML = `<div class="generated-text">${data.text}</div>`;
    } catch (error) {
        console.error('Error generating text:', error);
        alert('Error generating text: ' + error.message);
    }
}

document.getElementById('generate-text-btn').addEventListener('click', generateText);