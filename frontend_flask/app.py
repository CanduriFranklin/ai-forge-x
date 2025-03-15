from flask import Flask, render_template, request, jsonify
import os
import requests

app = Flask(__name__, static_folder='static', template_folder='templates')

# Asegúrate de que las claves de API estén configuradas correctamente
nebius_image_api = os.getenv("NEBIUS_IMAGE_API")
nebius_text_api = os.getenv("NEBIUS_TEXT_API")
nebius_api_key = os.getenv("NEBIUS_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-image', methods=['POST'])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt')
    width = data.get('width', 512)
    height = data.get('height', 512)
    steps = data.get('steps', 30)
    negative_prompt = data.get('negative_prompt', '')
    seed = data.get('seed', -1)

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    headers = {
        'Authorization': f'Bearer {nebius_api_key}',
        'Content-Type': 'application/json'
    }

    payload = {
        "prompt": prompt,
        "width": width,
        "height": height,
        "steps": steps,
        "negative_prompt": negative_prompt,
        "seed": seed
    }

    try:
        response = requests.post(nebius_image_api, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        image_data = response.json()['data'][0]['b64_json']
        return jsonify({'image': image_data})
    except requests.exceptions.RequestException as e:
        print(f"Error generating image: {e}")
        return jsonify({'error': str(e)}), response.status_code if response else 500

@app.route('/generate-text', methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt')
    temperature = data.get('temperature', 0.7)
    max_tokens = data.get('max_tokens', 1024)

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    headers = {
        'Authorization': f'Bearer {nebius_api_key}',
        'Content-Type': 'application/json'
    }

    payload = {
        "prompt": prompt,
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(nebius_text_api, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors
        text = response.json()['choices'][0]['text'].strip()
        return jsonify({'text': text})
    except requests.exceptions.RequestException as e:
        print(f"Error generating text: {e}")
        return jsonify({'error': str(e)}), response.status_code if response else 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)