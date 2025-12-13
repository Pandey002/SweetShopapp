import { query } from '../config/database';

export interface IUser {
    id: string;
    username: string;
    password: string;
    role: 'admin' | 'user';
}

export const createUserTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
    );
  `;

    try {
        await query(createTableQuery);
        console.log('User table created or already exists');
    } catch (error) {
        console.error('Error creating user table:', error);
        throw error;
    }
};
