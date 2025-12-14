import request from 'supertest';
import { app } from '../src/index';
import pool from '../src/config/database';

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        // Clean up text users before test
        await pool.query('DELETE FROM users WHERE username = $1', ['testuser']);
    });

    afterAll(async () => {
        // Close database connection to avoid open handles
        await pool.end();
    });

    it('POST /api/auth/register should create a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        // If it fails, log the error to help debugging
        if (res.status !== 201) {
            console.log('Register failed with status:', res.status);
            console.log('Response body:', res.body);
        }

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message');
    });

    describe('POST /api/auth/login', () => {
        it('should login with registered user and return token and user details', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'testuser',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user).toHaveProperty('username', 'testuser');
            expect(res.body.user).toHaveProperty('role');
        });
    });
});
