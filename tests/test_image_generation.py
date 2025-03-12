import unittest
from unittest.mock import patch
from backend.app import app

class TestImageGeneration(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()

    @patch('backend.app.requests.post')  # Corregido el path del mock
    def test_generate_image(self, mock_post):
        # Simular una respuesta exitosa de la API
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "image": "base64_encoded_image_data",
            "status": "success"
        }

        response = self.app.post('/generate-image', json={"prompt": "a mountainous landscape"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("image", response.json)
        self.assertIn("explanation", response.json)

    def test_generate_image_no_prompt(self):
        response = self.app.post('/generate-image', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json)

if __name__ == "__main__":
    unittest.main()
