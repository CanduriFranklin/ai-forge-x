from flask import Flask, render_template, request, jsonify
import os
from openai import OpenAI

app = Flask(__name__, static_folder='static', template_folder='templates')

client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY")
)

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

    response = client.images.generate(
        model="stability-ai/sdxl",
        response_format="b64_json",
        extra_body={
            "response_extension": "webp",
            "width": width,
            "height": height,
            "num_inference_steps": steps,
            "negative_prompt": negative_prompt,
            "seed": seed
        },
        prompt=prompt
    )

    return jsonify(response.to_json())

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)