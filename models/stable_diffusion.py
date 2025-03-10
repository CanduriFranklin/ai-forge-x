from nebius import NebiusClient

class StableDiffusion:
    def __init__(self, api_key):
        self.client = NebiusClient(api_key=api_key)

    def generate_image(self, prompt):
        response = self.client.generate_image(prompt=prompt)
        return response
