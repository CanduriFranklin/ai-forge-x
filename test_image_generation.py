import os
from openai import OpenAI
from apis_config import IMAGE_GENERATION_CONFIG

def generate_image():
    api_key = os.getenv("NEBIUS_API_KEY")
    if not api_key:
        raise ValueError("API key not found. Please set the NEBIUS_API_KEY environment variable.")
    
    client = OpenAI(api_key=api_key)
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
        prompt="YOUR_PROMPT"
    )
    print(response)

if __name__ == "__main__":
    generate_image()
