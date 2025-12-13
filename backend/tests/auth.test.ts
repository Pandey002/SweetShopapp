import request from 'supertest';
import { app } from '../src/index';

describe('Auth Integration Tests', () => {
    it('POST /api/auth/register should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
    });
});
