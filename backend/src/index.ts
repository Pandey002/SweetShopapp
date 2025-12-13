import express from 'express';
import dotenv from 'dotenv';
import { createUserTable } from './models/user.model';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

const startServer = async () => {
    try {
        // Initialize database
        await createUserTable();

        app.listen(port, () => {
            console.log(`Server id running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
