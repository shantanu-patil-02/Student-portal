import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { seedSampleData } from './config/seed.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);


// Initialize Database Connection
export const initDatabase = async () => {

  await connectDB();
  await seedSampleData();
};
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint (for DevOps monitoring and Docker healthchecks)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'student-task-manager-backend',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 5000;

// Only listen if executed directly (e.g., node backend/server.js)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`[Backend] Student Task Manager API server running on port ${PORT}`);
  });
}

export default app;
