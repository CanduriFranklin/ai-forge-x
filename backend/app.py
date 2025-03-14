from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import sys
import logging
import csv
import json
from io import StringIO
from config import Config  # Cambiado de .config a config

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
CORS(app)  # Habilitando CORS para todas las rutas
app.config.from_object(Config)

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
        # Customizable parameters
        width = request.json.get("width", 512)
        height = request.json.get("height", 512)
        steps = request.json.get("steps", 30)
        negative_prompt = request.json.get("negative_prompt", "")
        seed = request.json.get("seed", -1)
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
            
        logging.debug(f"Received prompt: {prompt}")
        logging.debug(f"Parameters: width={width}, height={height}, steps={steps}, negative_prompt='{negative_prompt}', seed={seed}")
        
        try:
            # Analyze prompt for explanations
            prompt_keywords = [word.strip() for word in prompt.replace(',', ' ').split() if len(word.strip()) > 3]
            key_elements = prompt_keywords[:5]  # Main elements for explanation
            
            response = client.images.generate(
                model="stability-ai/sdxl",
                response_format="url",
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
            
            logging.debug(f"API response: {response}")
            
            # Extract image URL from response
            if hasattr(response, 'data') and len(response.data) > 0:
                image_url = response.data[0].url
                
                # Create detailed explanation
                explanation = {
                    "process": f"Image generated using Stable Diffusion XL model",
                    "parameters": {
                        "resolution": f"{width}x{height} pixels",
                        "inference steps": steps,
                        "negative prompt": negative_prompt if negative_prompt else "No negative prompt used",
                        "seed": "Random" if seed == -1 else seed
                    },
                    "key_elements": f"The image focused on representing: {', '.join(key_elements)}",
                    "interpretation": f"The AI interpreted your prompt by focusing primarily on the visual elements described. "
                                     f"The style and composition were determined from the keywords in your prompt.",
                    "suggestions": "For more specific results, try including detailed descriptions of style, lighting, and composition."
                }
                
                return jsonify({
                    "image": image_url,
                    "explanation": explanation
                })
            else:
                return jsonify({"error": "No image URL in response"}), 500
                
        except Exception as e:
            logging.error(f"API error: {str(e)}")
            return jsonify({"error": f"Error from image generation API: {str(e)}"}), 500
            
    except Exception as e:
        logging.error(f"Error generating image: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@app.route("/generate-text", methods=["POST"])
def generate_text():
    try:
        prompt = request.json.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
            
        logging.debug(f"Received text prompt: {prompt}")
        
        try:
            response = client.chat.completions.create(
                model="meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024,
                temperature=0.7,
                top_p=0.9,
                extra_body={
                    "top_k": 50
                }
            )
            
            logging.debug(f"API response: {response}")
            
            if hasattr(response, 'choices') and len(response.choices) > 0:
                generated_text = response.choices[0].message.content
                return jsonify({
                    "text": generated_text,
                    "explanation": "Text generated successfully"
                })
            else:
                return jsonify({"error": "No text in response"}), 500
                
        except Exception as e:
            logging.error(f"API error: {str(e)}")
            return jsonify({"error": f"Error from text generation API: {str(e)}"}), 500
            
    except Exception as e:
        logging.error(f"Error generating text: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

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
