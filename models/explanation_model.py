import os
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
        return response.to_json()
