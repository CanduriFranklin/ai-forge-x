IMAGE_GENERATION_CONFIG = {
    "model": "stability-ai/sdxl",
    "prompt": "An elephant in a desert",
    "response_format": "b64_json",
    "extra_body": {
        "response_extension": "webp",
        "width": 512,
        "height": 512,
        "num_inference_steps": 30,
        "seed": -1,
        "negative_prompt": "Giraffes, night sky"
    }
}
