// Import the tool to send commands to the database
import { query } from '../config/database';

// Define what a "User" looks like in our system.
// This is like a template or a form that every user must fit into.
export interface IUser {
  id: string;          // A unique ID tag for the user
  username: string;    // The name they use to log in
  password: string;    // Their secret password
  role: 'admin' | 'user'; // What permission level they have (manager or regular customer)
}

// Function to create the physical list (table) in the database where users will be stored
export const createUserTable = async () => {
  // The command to tell the database: "Create a list called 'users' if it doesn't exist yet."
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Auto-generate a unique tag
      username VARCHAR(255) UNIQUE NOT NULL,          -- Username must be unique and not empty
      password VARCHAR(255) NOT NULL,                 -- Password cannot be empty
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')) -- Role must be either 'admin' or 'user'
    );
  `;

  try {
    // Send the command to the database
    await query(createTableQuery);
    console.log('User table created or already exists');
  } catch (error) {
    // If there's a problem creating the list, report it
    console.error('Error creating user table:', error);
    throw error;
  }
};
