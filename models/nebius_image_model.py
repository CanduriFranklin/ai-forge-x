import os
from openai import OpenAI

class NebiusImageModel:
    def __init__(self):
        self.client = OpenAI(
            base_url="https://api.studio.nebius.com/v1/",
            api_key=os.environ.get("NEBIUS_API_KEY")
        )

    def generate_image(self, prompt, width=1024, height=1024, steps=30, negative_prompt="", seed=-1):
        try:
            response = self.client.images.generate(
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
            return {
                "success": True,
                "data": response.data[0].b64_json if response.data else None,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "data": None,
                "error": str(e)
            }