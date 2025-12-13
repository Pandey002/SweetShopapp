// Import necessary tools to build the website server and handle configuration
import express from 'express';
import dotenv from 'dotenv';
// Import the function to prepare the place where user information is stored
import { createUserTable } from './models/user.model';

// Load settings from the configuration file (like passwords and addresses)
dotenv.config();

// Create the main application (the "brain" of the website)
const app = express();
// Decide which "door" (port) the website will open on. If not specified, use door 3000.
const port = process.env.APP_PORT || 3000;

// Function to start the website server
const startServer = async () => {
    try {
        // First, make sure the "filing cabinet" for users is ready
        await createUserTable();

        // Start listening for visitors on the specified door
        app.listen(port, () => {
            console.log(`Server is running and listening on port ${port}`);
        });
    } catch (error) {
        // If something goes wrong while starting, report the error and stop
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Actually run the function to start everything up
startServer();
