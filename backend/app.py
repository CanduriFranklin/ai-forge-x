from flask import Flask, request, jsonify, render_template, send_file
import requests
from dotenv import load_dotenv
import os
import sys
import logging
import csv
import json
from io import StringIO
from .config import Config

# Ensure the openai module is installed
try:
    from openai import OpenAI
except ImportError:
    print("The openai module is not installed. Install it using 'pip install openai'")
    sys.exit(1)

# Set the PYTHONPATH environment variable to include the models directory
os.environ['PYTHONPATH'] = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models')))
sys.path.append('..')

# Ensure the ExplanationModel and StableDiffusionModel modules exist
try:
    from models.explanation_model import ExplanationModel
    from models.stable_diffusion import StableDiffusionModel
except ImportError as e:
    print("Error importing modules: " + repr(e))
    sys.exit(1)

app = Flask(__name__, static_folder='../frontend_flask/static', template_folder='../frontend_flask/templates')

load_dotenv()

# Actualización de las URLs de la API
base_url = "https://api.studio.nebius.com/v1"
image_api_url = f"{base_url}/images/generations"  # Endpoint correcto para generación de imágenes
text_api_url = f"{base_url}/completions"  # Endpoint correcto para generación de texto

explanation_model = ExplanationModel()
stable_diffusion_model = StableDiffusionModel()

# Configure logging
logging.basicConfig(level=logging.DEBUG)

client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY")
)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/generate-image", methods=["POST"])
def generate_image():
    try:
        prompt = request.json.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
            
        logging.debug(f"Received prompt: {prompt}")
        
        headers = {
            "Authorization": f"Bearer {os.getenv('NEBIUS_API_KEY')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024"
        }
        
        response = requests.post(
            image_api_url,
            headers=headers,
            json=payload
        )
        
        logging.debug(f"External API response status: {response.status_code}")
        
        if response.status_code != 200:
            return jsonify({"error": "Error from image generation API", "details": response.text}), response.status_code
            
        try:
            response_json = response.json()
            return jsonify({
                "image": response_json.get("data", [{}])[0].get("url", ""),
                "explanation": "Image generated successfully"
            })
        except (ValueError, IndexError) as e:
            logging.error(f"Invalid JSON response from image generation API: {str(e)}")
            return jsonify({"error": "Invalid response from image generation API"}), 500
            
    except Exception as e:
        logging.error(f"Error generating image: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/generate-text", methods=["POST"])
def generate_text():
    prompt = request.json.get("prompt")
    response = requests.post(text_api_url, json={"prompt": prompt})
    return jsonify(response.json())

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt")
    model_type = data.get("model_type")

    if model_type == "text":
        result = explanation_model.generate_explanation(prompt)
    elif model_type == "image":
        result = stable_diffusion_model.generate_image(prompt)
    else:
        return jsonify({"error": "Invalid model type"}), 400

    return jsonify({"result": result})

@app.route("/generate-image-openai", methods=["POST"])
def generate_image_openai():
    prompt = request.json.get("prompt")
    response = client.images.generate(
        model="stability-ai/sdxl",
        response_format="b64_json",
        extra_body={
            "response_extension": "webp",
            "width": 1024,
            "height": 1024,
            "num_inference_steps": 30,
            "negative_prompt": "",
            "seed": -1
        },
        prompt=prompt
    )
    return jsonify(response.to_json())

@app.route("/execute-query", methods=["POST"])
def execute_query():
    query = request.json.get("query")
    logging.debug(f"Executing query: {query}")
    # Add code to execute the query and return the results
    results = {"data": "Query results", "explanation": "Explanation of the results", "index": 1, "confidence_score": 0.95}
    return jsonify(results)

@app.route("/export-csv", methods=["GET"])
def export_csv():
    data = [
        {"column1": "value1", "column2": "value2"},
        {"column1": "value3", "column2": "value4"}
    ]
    si = StringIO()
    cw = csv.DictWriter(si, fieldnames=data[0].keys())
    cw.writeheader()
    cw.writerows(data)
    output = si.getvalue()
    return send_file(StringIO(output), mimetype="text/csv", as_attachment=True, attachment_filename="data.csv")

@app.route("/export-json", methods=["GET"])
def export_json():
    data = [
        {"column1": "value1", "column2": "value2"},
        {"column1": "value3", "column2": "value4"}
    ]
    return jsonify(data)

@app.route("/execute-inference", methods=["POST"])
def execute_inference():
    logging.debug("Executing inference")
    # Add code to execute inference and return the results
    results = {"data": "Inference results"}
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
