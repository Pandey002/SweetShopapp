import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    port: parseInt(process.env.PORT || '5432'),
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
