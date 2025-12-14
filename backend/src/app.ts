import express from 'express';
import cors from 'cors';
import { createUserTable } from './models/user.model';
import { createSweetTable } from './models/sweet.model';
import authRoutes from './routes/auth.routes';
import sweetRoutes from './routes/sweet.routes';

export const app = express();

// Enable CORS for all routes
app.use(cors());

// Debug Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Database Tables
const initDB = async () => {
    try {
        await createUserTable();
        await createSweetTable();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Failed to initialize database tables:', error);
    }
};

// Initialize tables immediately
initDB();

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
