# AI ForgeX Suite - Developer Guide

## Development Environment Setup

### Prerequisites
- Python 3.8+ installed on your system
- Node.js 14+ (if extending frontend features)
- Git for version control
- A text editor or IDE (VS Code recommended)
- Nebius Studio account with API keys

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone [repository-url]
   cd ai-forge-x
   ```

2. **Set Up Python Virtual Environment**
   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   pip install -r backend/requirements.txt
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```
   NEBIUS_IMAGE_API=https://api.studio.nebius.com/v1/
   NEBIUS_TEXT_API=https://api.studio.nebius.com/v1/
   NEBIUS_API_KEY=your_api_key_here
   OPENAI_API_KEY=your_api_key_here
   ```

5. **Run Tests**
   ```bash
   python -m pytest tests/
   ```

## Project Structure

```
ai-forge-x/
├── backend/                # Flask backend
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   └── ...
├── frontend_flask/         # Frontend Flask server
│   ├── app.py
│   ├── static/             # Static assets
│   └── templates/          # HTML templates
├── models/                 # AI model wrappers
│   ├── explanation_model.py
│   └── stable_diffusion.py
├── tests/                  # Test suite
├── docs/                   # Documentation
├── .env                    # Environment variables
└── requirements.txt        # Project dependencies
```

## Key Components

### Backend (Flask)

The backend is built with Flask and provides API endpoints for the frontend to interact with.

#### Running the Backend
```bash
cd backend
python app.py
```
This will start the backend server on `http://localhost:5000`.

#### API Endpoints

- **`/generate-image` (POST)**: Generates images using the Stable Diffusion model
  ```json
  {
    "prompt": "A description of the image to generate"
  }
  ```

- **`/generate-text` (POST)**: Generates text using the LLaMA model
  ```json
  {
    "prompt": "The text prompt for generation"
  }
  ```

### Frontend

The frontend is a Flask application serving HTML, CSS, and JavaScript.

#### Running the Frontend
```bash
cd frontend_flask
python app.py
```
This will start the frontend server on `http://localhost:5001`.

### Models

The models directory contains wrapper classes for the AI models used in the application.

#### Explanation Model (`explanation_model.py`)
This class wraps the LLaMA model and is responsible for text generation.

#### Stable Diffusion Model (`stable_diffusion.py`)
This class wraps the Stable Diffusion model and is responsible for image generation.

## Extending the Application

### Adding a New AI Model

1. **Create a new model wrapper class** in the `models/` directory
   ```python
   # models/new_model.py
   import os
   from openai import OpenAI

   class NewModel:
       def __init__(self):
           self.client = OpenAI(
               base_url="https://api.studio.nebius.com/v1/",
               api_key=os.environ.get("NEBIUS_API_KEY")
           )

       def generate_output(self, prompt):
           # Implement your model-specific logic here
           response = self.client.some_endpoint.generate(
               model="some-model",
               prompt=prompt
           )
           return response.json()
   ```

2. **Import and instantiate your model** in `backend/app.py`
   ```python
   from models.new_model import NewModel
   new_model = NewModel()
   ```

3. **Add a new endpoint** to use your model
   ```python
   @app.route("/generate-new", methods=["POST"])
   def generate_new():
       prompt = request.json.get("prompt")
       result = new_model.generate_output(prompt)
       return jsonify(result)
   ```

4. **Update the frontend** to use your new endpoint

### Adding a New Frontend Feature

1. **Update the HTML** in `frontend_flask/templates/index.html`
2. **Add new styles** in `frontend_flask/static/Generate.css`
3. **Implement new functionality** in `frontend_flask/static/Generate.js`

## Testing

### Running Tests

```bash
python -m pytest tests/
```

### Writing New Tests

1. Create a new test file in the `tests/` directory
2. Implement test functions using the pytest framework
3. Run the tests to ensure they pass

Example:
```python
# tests/test_new_feature.py
import unittest
from backend.app import app

class TestNewFeature(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_new_endpoint(self):
        response = self.app.post('/generate-new', json={"prompt": "Test prompt"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("result", response.json)

if __name__ == '__main__':
    unittest.main()
```

## Deployment

### Local Deployment

1. Start the backend server:
   ```bash
   cd backend
   python app.py
   ```

2. Start the frontend server:
   ```bash
   cd frontend_flask
   python app.py
   ```

3. Access the application at `http://localhost:5001`

### Nebius Studio Deployment

1. **Prepare the application**
   - Update the configuration to use environment variables
   - Optimize for production use

2. **Deploy to Nebius Studio**
   - Follow the Nebius Studio documentation for deployment steps
   - Set up the required environment variables in the Nebius Studio dashboard

3. **Verify the deployment**
   - Test all endpoints and functionality after deployment

## Performance Optimization

### Backend Optimization

1. **Use asynchronous endpoints** for long-running operations
2. **Implement caching** for frequently requested content
3. **Optimize model loading** to reduce initialization time

### Frontend Optimization

1. **Minify and bundle** CSS and JavaScript files
2. **Implement lazy loading** for images and heavy content
3. **Use client-side caching** for generated content

## Troubleshooting

### Common Development Issues

1. **API key errors**
   - Ensure the `.env` file contains valid API keys
   - Verify the API keys have necessary permissions

2. **Module import errors**
   - Check the Python path is configured correctly
   - Verify all dependencies are installed

3. **CORS errors**
   - Ensure CORS is properly configured in `backend/app.py`
   - Verify the frontend is using the correct API URLs

### Debugging Tools

1. **Flask Debug Mode**
   - The backend runs in debug mode by default
   - Check the terminal output for errors

2. **Browser Developer Tools**
   - Use the Network tab to monitor API requests
   - Use the Console to check for JavaScript errors

## API Documentation

### Image Generation API

**Endpoint**: `/generate-image`
**Method**: POST
**Request Format**:
```json
{
  "prompt": "A description of the image to generate"
}
```
**Response Format**:
```json
{
  "image": "URL or base64 encoded image",
  "explanation": "Explanation of the generation process"
}
```

### Text Generation API

**Endpoint**: `/generate-text`
**Method**: POST
**Request Format**:
```json
{
  "prompt": "The text prompt for generation"
}
```
**Response Format**:
```json
{
  "text": "Generated text content",
  "explanation": "Explanation of the generation process"
}
```

## Contributing to the Project

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Write or update tests
5. Submit a pull request

## Best Practices

1. Follow PEP 8 style guide for Python code
2. Document all functions and classes
3. Write unit tests for new features
4. Keep the UI responsive and accessible
5. Handle errors gracefully and provide helpful error messages

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Nebius Studio Documentation](https://nebius.ai/docs)
- [Stable Diffusion Documentation](https://stability.ai/documentation)
- [LLaMA Model Documentation](https://ai.meta.com/llama/)