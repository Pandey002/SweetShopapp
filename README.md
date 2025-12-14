Sweet Shop Management System
Build a secure, full-stack e-commerce inventory system using TDD and AI-Assisted Development.

React TypeScript Node.js PostgreSQL Tailwind CSS

📋 Table of Contents
✨ Introduction
⚙️ Tech Stack
🔋 Features
🤖 AI & TDD Workflow
🤸 Quick Start
🚀 Deployment

✨ Introduction
Build a robust Full-Stack Inventory System with React, Node.js, and PostgreSQL! Implement secure authentication using JWT, manage real-time inventory updates, and deliver a seamless shopping experience.

This project demonstrates modern software practices:

Test-Driven Development (TDD) for reliability.
Glassmorphism UI for aesthetics.
AI-Pair Programming for efficient debugging and architecture planning.

⚙️ Tech Stack
React: Component-based architecture with hooks for managing state.
TypeScript: Static typing for both Frontend & Backend.
Node.js & Express: RESTful API for business logic and routing.
PostgreSQL: Relational database for robust data integrity.
Tailwind CSS: Utility-first CSS for the "Glassmorphism" design.
Vite: Frontend build tool for instant HMR.
Jest & Supertest: Testing backbone for TDD workflow.
Axios: HTTP client with interceptors for API communication.

🔋 Features
👉 Secure Authentication: Complete user registration and login flows protected by JWT and Bcrypt.
👉 Inventory Management: Real-time tracking of stock levels. Users can purchase, Admins can restock.
👉 Admin Dashboard: Protected interface for managing sweets and inventory.
👉 Glassmorphism UI: Stunning modern interface with translucent cards and gradients.
👉 TDD Architecture: Fully tested backend routes (GET, POST, DELETE).
👉 Global State: Efficient session and cart management.
👉 Deployment Ready: Configured for Vercel (Frontend) and Render (Backend).

🤖 AI & TDD Workflow
This project leverages AI Tools (Gemini, ChatGPT) as "Pair Programmers" to enhance the TDD process.

Planning: Database schema and API contract design.
Debugging: Analyzing logs (CORS, ECONNREFUSED) and fixing config.
Refactoring: Improving code patterns and error handling.

🤸 Quick Start
Follow these steps to set up the project locally.

Prerequisites
Git
Node.js (v18+)
PostgreSQL (Running locally or in the cloud)
1. Clone the Repository
git clone https://github.com/Vinciarya/sweetshopkata.git
cd sweetshopkata
2. Backend Setup
cd backend
npm install

# Create .env file
echo "PORT=3000" >> .env
echo "DATABASE_URL=postgres://user:pass@localhost:5432/sweetshop" >> .env
echo "JWT_SECRET=your_secret_key" >> .env

# Run server (and migrations if applicable)
npm run dev
3. Frontend Setup
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000/api" >> .env

# Start React Dev Server
npm run dev
