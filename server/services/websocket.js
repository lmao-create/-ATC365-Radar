import { getAllFlights } from '../models/Flight.js';

const clients = new Set();
let updateInterval;

export function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);

    // Send initial data
    sendInitialData(ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        handleClientMessage(data, ws);
      } catch (error) {
        console.error('Error parsing message:', error.message);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      clients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });
  });

  // Start broadcasting position updates
  startBroadcasting();
}

function sendInitialData(ws) {
  try {
    const flights = getAllFlights();
    ws.send(JSON.stringify({
      type: 'initial',
      data: flights,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error sending initial data:', error.message);
  }
}

function startBroadcasting() {
  // Send position updates every 500ms
  updateInterval = setInterval(() => {
    try {
      const flights = getAllFlights();
      const message = JSON.stringify({
        type: 'update',
        data: flights,
        timestamp: Date.now()
      });

      clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
          client.send(message);
        }
      });
    } catch (error) {
      console.error('Error broadcasting updates:', error.message);
    }
  }, 500);
}

function handleClientMessage(data, ws) {
  // Handle specific client messages if needed
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      break;
    default:
      console.log('Unknown message type:', data.type);
  }
}

export function broadcastPositionUpdate(flightData) {
  const message = JSON.stringify({
    type: 'position_update',
    data: flightData,
    timestamp: Date.now()
  });

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

export function getConnectedClients() {
  return clients.size;
}

export function stopBroadcasting() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
}
