import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.studio.nebius.com/v1/",
    api_key=os.environ.get("NEBIUS_API_KEY")
)

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

print(response.to_json())