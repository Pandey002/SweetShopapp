import request from 'supertest';
import { app } from '../src/app';
import pool from '../src/config/database';

describe('Sweets Integration Tests', () => {
    let adminToken: string;
    let userToken: string;
    let sweetId: number;

    const adminUser = {
        username: 'adminUser',
        password: 'password123',
        role: 'admin'
    };

    const regularUser = {
        username: 'regularUser',
        password: 'password123',
        role: 'user'
    };

    beforeAll(async () => {
        // Clean up
        await pool.query('DELETE FROM users WHERE username IN ($1, $2)', [adminUser.username, regularUser.username]);
        await pool.query('DELETE FROM sweets');

        // Register Admin
        await request(app).post('/api/auth/register').send(adminUser);

        // Manual Role Update required because register defaults to 'user'
        await pool.query('UPDATE users SET role = $1 WHERE username = $2', ['admin', adminUser.username]);

        // Login Admin
        const adminRes = await request(app).post('/api/auth/login').send({ username: adminUser.username, password: adminUser.password });
        adminToken = adminRes.body.token;

        // Register and Login User
        await request(app).post('/api/auth/register').send(regularUser);
        const userRes = await request(app).post('/api/auth/login').send({ username: regularUser.username, password: regularUser.password });
        userToken = userRes.body.token;
    });

    afterAll(async () => {
        await pool.query('DELETE FROM users WHERE username IN ($1, $2)', [adminUser.username, regularUser.username]);
        await pool.query('DELETE FROM sweets');
        await pool.end();
    });

    describe('POST /api/sweets', () => {
        it('should allow admin to create a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Bar',
                    price: 2.50,
                    quantity: 100,
                    category: 'Chocolate'
                });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Chocolate Bar');
            sweetId = res.body.id;
        });

        it('should deny non-admin users', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Candy',
                    price: 1.00,
                    quantity: 50,
                    category: 'Candy'
                });

            expect(res.status).toBe(403);
        });
    });

    describe('GET /api/sweets', () => {
        it('should return list of sweets for authenticated users', async () => {
            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search sweets by name', async () => {
            const res = await request(app)
                .get('/api/sweets/search?q=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.status).toBe(200);
            expect(res.body[0].name).toContain('Chocolate');
        });
    });

    describe('PUT /api/sweets/:id', () => {
        it('should allow admin to update a sweet', async () => {
            const res = await request(app)
                .put(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 3.00 });

            expect(res.status).toBe(200);
            expect(res.body.price).toBe('3.00'); // pg decimal returns string
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should decrease quantity on purchase', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/purchase`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 5 });

            expect(res.status).toBe(200);
            expect(res.body.quantity).toBe(95); // 100 - 5
        });
    });

    describe('POST /api/sweets/:id/restock', () => {
        it('should allow admin to restock', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ quantity: 10 });

            expect(res.status).toBe(200);
            expect(res.body.quantity).toBe(105); // 95 + 10
        });

        it('should deny non-admin from restocking', async () => {
            const res = await request(app)
                .post(`/api/sweets/${sweetId}/restock`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ quantity: 10 });

            expect(res.status).toBe(403);
        });
    });

    describe('DELETE /api/sweets/:id', () => {
        it('should allow admin to delete a sweet', async () => {
            const res = await request(app)
                .delete(`/api/sweets/${sweetId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.status).toBe(204);
        });
    });
});
