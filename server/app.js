import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { initializeDatabase } from './config/database.js';
import { setupWebSocket } from './services/websocket.js';
import { startFlightGenerator } from './services/flightGenerator.js';

// Routes
import flightsRouter from './routes/flights.js';
import airportsRouter from './routes/airports.js';
import airspaceRouter from './routes/airspace.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/flights', flightsRouter);
app.use('/api/airports', airportsRouter);
app.use('/api/airspace', airspaceRouter);

// WebSocket
setupWebSocket(wss);

// Initialize and start
const PORT = process.env.PORT || 3001;

try {
  console.log('Initializing database...');
  initializeDatabase();

  console.log('Starting flight generator...');
  startFlightGenerator();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`WebSocket server ready`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}

export { app, wss };
