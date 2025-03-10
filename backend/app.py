from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
from models.explanation_model import ExplanationModel
from models.stable_diffusion import StableDiffusionModel

app = Flask(__name__)

load_dotenv()

image_api_url = os.getenv("NEBIUS_IMAGE_API")
text_api_url = os.getenv("NEBIUS_TEXT_API")

explanation_model = ExplanationModel()
stable_diffusion_model = StableDiffusionModel()

@app.route("/")
def index():
    return "Welcome to the AI Forge API!"

@app.route("/generate-image", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt")
    response = requests.post(image_api_url, json={"prompt": prompt})
    return jsonify(response.json())

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

if __name__ == "__main__":
    app.run(debug=True)
