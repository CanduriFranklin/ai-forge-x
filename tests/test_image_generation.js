import unittest
from unittest.mock import patch
from frontend_flask.app import app  # Corregido el path del módulo

class TestImageGeneration(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()

    @patch('frontend_flask.app.requests.post')  # Corregido el path del mock
    def test_generate_image(self, mock_post):
        # Simular una respuesta exitosa de la API
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "data": [{"b64_json": "base64_encoded_image_data"}]
        }

        response = self.app.post('/generate-image', json={"prompt": "a mountainous landscape"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("image", response.json)

    def test_generate_image_no_prompt(self):
        response = self.app.post('/generate-image', json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json)

if __name__ == "__main__":
    unittest.main()
