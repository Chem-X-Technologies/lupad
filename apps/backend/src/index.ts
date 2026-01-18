import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import 'express-async-errors';
import { prisma } from './lib/prisma.js';
import redis from './lib/redis.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import routes from './routes/index.js';

// Load environment variables
dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*', // Configure this properly in production
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(requestLogger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Lupad API Server',
    version: '0.1.0',
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use(notFoundHandler);

// Error Handler (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Add more socket event handlers here
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Lupad API Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
