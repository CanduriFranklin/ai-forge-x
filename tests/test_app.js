const request = require('supertest');
const app = require('../frontend_flask/app'); // Adjust the path as necessary

describe('Test the root path', () => {
    test('It should respond with a 200 status code and contain "Welcome"', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Welcome');
    });
});