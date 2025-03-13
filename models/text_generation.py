import openai

class TextGenerationModel:
    def __init__(self, api_key):
        openai.api_key = api_key

    def generate_text(self, prompt, max_tokens=100, temperature=0.7):
        response = openai.Completion.create(
            engine="davinci",
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].text.strip()
