from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/generate-image", methods=["POST"])
def generate_image():
    prompt = request.json.get("prompt")
    response = requests.post("https://nebius.ai/generate", json={"prompt": prompt})
    return jsonify(response.json())

@app.route("/generate-text", methods=["POST"])
def generate_text():
    prompt = request.json.get("prompt")
    response = requests.post("https://nebius.ai/generate-text", json={"prompt": prompt})
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)
