# This file is correctly located in the "models" folder.
import os
import json
from openai import OpenAI

class ExplanationModel:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://api.studio.nebius.com/v1/",
            api_key=os.environ.get("NEBIUS_API_KEY")
        )

    def generate_explanation(self, prompt):
        response = self.client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
            max_tokens=512,
            temperature=0.6,
            top_p=0.9,
            extra_body={
                "top_k": 50
            },
            messages=[{"role": "user", "content": prompt}]
        )
        response_json = response.json()  # Ensure the response is parsed as JSON
        with open('explanation_response.json', 'w') as f:
            json.dump(response_json, f, indent=4)
        return response_json
