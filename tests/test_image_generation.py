import unittest
from backend.app import app

class TestImageGeneration(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_generate_image(self):
        response = self.app.post('/generate-image', json={"prompt": "a mountainous landscape"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("image", response.json())
        self.assertIn("explanation", response.json())

if __name__ == "__main__":
    unittest.main()
