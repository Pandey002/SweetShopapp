// Import the tool to connect to the "filing cabinet" (Database)
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load the secret keys and addresses from the configuration file
dotenv.config();

// Create a connection pool. Think of this like a group of phone lines ready to talk to the database.
// We use the settings (host, user, password) to verify we are allowed to access the data.
const pool = new Pool({
    host: process.env.HOST,        // Address of the database's computer
    user: process.env.USER,        // Username to log in
    password: process.env.PASSWORD,// Password to log in
    database: process.env.DB,      // Name of the specific collection of data we want
    port: parseInt(process.env.PORT || '5432'), // The specific door number to knock on
});

// When a connection is successfully made, print a message
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

// Export a helper function to easily ask the database questions or give it commands
export const query = (text: string, params?: any[]) => pool.query(text, params);
// Export the connection pool so other parts of the app can use it
export default pool;
