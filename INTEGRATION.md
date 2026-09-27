# ATC365 Radar - Server Integration Guide

This radar system is designed to work with any ATC server. Use this guide to integrate your own flight data source.

## Architecture

```
Your ATC Server (Roblox/Other) 
         ↓
    Flight Data
         ↓
   Backend Server (Node.js)
    ↙         ↖
   ↙           ↖
WebSocket    REST API
   ↙           ↖
Frontend       External Systems
```

## Integration Methods

### Method 1: HTTP POST (Simplest)

Your server sends flight data via HTTP POST to the backend:

```bash
curl -X POST http://localhost:3001/api/flights/update \
  -H "Content-Type: application/json" \
  -d '[
    {
      "callsign": "AAL123",
      "latitude": 40.6413,
      "longitude": -73.7781,
      "altitude": 5000,
      "heading": 180,
      "ground_speed": 450,
      "vertical_speed": 0,
      "squawk": "1234",
      "status": "active"
    }
  ]'
```

### Method 2: Direct Database Access

If your ATC server uses a database:
- Store flight data in the backend database
- Backend queries it directly
- No integration needed from your server

### Method 3: WebSocket Direct Connection

Your server connects directly to our WebSocket server and sends flight updates:

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  // Send flight data periodically
  setInterval(() => {
    ws.send(JSON.stringify({
      type: 'flight_update',
      data: {
        callsign: 'AAL123',
        latitude: 40.6413,
        longitude: -73.7781,
        altitude: 5000,
        heading: 180,
        ground_speed: 450,
        vertical_speed: 0,
        squawk: '1234',
        status: 'active'
      }
    }));
  }, 500);
};
```

## Flight Data Format

```typescript
interface FlightData {
  callsign: string;           // e.g., "AAL123", "UAL456"
  latitude: number;           // Decimal degrees (-90 to 90)
  longitude: number;          // Decimal degrees (-180 to 180)
  altitude: number;           // Feet above sea level
  heading: number;            // Degrees (0-360)
  ground_speed: number;       // Knots
  vertical_speed?: number;    // Feet per minute (optional)
  squawk?: string;            // Transponder code (optional, default: "1200")
  status?: string;            // "active", "landing", "takeoff", etc.
  origin?: string;            // Airport ICAO code (optional)
  destination?: string;       // Airport ICAO code (optional)
  aircraft_type?: string;     // e.g., "B737", "A320" (optional)
}
```

## Environment Configuration

Create a `.env` file in the `server/` directory:

```bash
# Server
PORT=3001
NODE_ENV=development

# Database (SQLite by default)
DB_NAME=atc365_radar

# Optional: Enable HTTP endpoints for data ingestion
ENABLE_FLIGHT_ENDPOINT=true
FLIGHT_ENDPOINT_KEY=your_secret_key
```

## API Endpoints

### Get All Flights
```
GET /api/flights
```

Response:
```json
[
  {
    "id": 1,
    "callsign": "AAL123",
    "latitude": 40.6413,
    "longitude": -73.7781,
    "altitude": 5000,
    "heading": 180,
    "ground_speed": 450,
    "vertical_speed": 0,
    "squawk": "1234",
    "status": "active"
  }
]
```

### Update Flight Data (Requires API Key)
```
POST /api/flights/update
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

[
  {
    "callsign": "AAL123",
    "latitude": 40.6413,
    "longitude": -73.7781,
    "altitude": 5000,
    "heading": 180,
    "ground_speed": 450,
    "vertical_speed": 0,
    "squawk": "1234",
    "status": "active"
  }
]
```

### Get Airports
```
GET /api/airports
```

### Add Custom Airport
```
POST /api/airports
Content-Type: application/json

{
  "icao": "KJFK",
  "iata": "JFK",
  "name": "John F. Kennedy International",
  "latitude": 40.6413,
  "longitude": -73.7781,
  "elevation": 13
}
```

## WebSocket Protocol

### Client Connection
1. Connect to `ws://localhost:3001`
2. Receive initial flight data with `type: "initial"`
3. Receive updates with `type: "update"` every 500ms

### Sending Data (Server → Backend)
```json
{
  "type": "flight_update",
  "data": {
    "callsign": "AAL123",
    "latitude": 40.6413,
    "longitude": -73.7781,
    "altitude": 5000,
    "heading": 180,
    "ground_speed": 450,
    "vertical_speed": 0,
    "squawk": "1234",
    "status": "active"
  }
}
```

## Examples

### Roblox Integration (Lua)
```lua
local HttpService = game:GetService("HttpService")
local flightData = {
  callsign = "AAL123",
  latitude = 40.6413,
  longitude = -73.7781,
  altitude = 5000,
  heading = 180,
  ground_speed = 450,
  vertical_speed = 0,
  squawk = "1234",
  status = "active"
}

local json = HttpService:JSONEncode({flightData})
HttpService:PostAsync("http://localhost:3001/api/flights/update", json, Enum.HttpContentType.ApplicationJson)
```

### Python Integration
```python
import requests
import json
import time

BACKEND_URL = "http://localhost:3001/api/flights/update"
API_KEY = "your_secret_key"

def send_flight_data(flights):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }
    response = requests.post(BACKEND_URL, json=flights, headers=headers)
    return response.status_code == 200

flights = [
    {
        "callsign": "AAL123",
        "latitude": 40.6413,
        "longitude": -73.7781,
        "altitude": 5000,
        "heading": 180,
        "ground_speed": 450,
        "vertical_speed": 0,
        "squawk": "1234",
        "status": "active"
    }
]

# Send every 500ms
while True:
    send_flight_data(flights)
    time.sleep(0.5)
```

### JavaScript/Node.js Integration
```javascript
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  const flightData = {
    callsign: 'AAL123',
    latitude: 40.6413,
    longitude: -73.7781,
    altitude: 5000,
    heading: 180,
    ground_speed: 450,
    vertical_speed: 0,
    squawk: '1234',
    status: 'active'
  };

  // Send every 500ms
  setInterval(() => {
    ws.send(JSON.stringify({
      type: 'flight_update',
      data: flightData
    }));
  }, 500);
});
```

## Deployment

### Docker
```bash
docker-compose up
```

### Manual
```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in another terminal)
cd client
npm install
npm run dev
```

## Troubleshooting

### WebSocket Connection Refused
- Check backend is running on port 3001
- Check firewall allows port 3001
- Verify backend URL in frontend config

### Flights Not Updating
- Check flight data is being sent to backend
- Verify callsign field is unique
- Check browser console for errors

### Database Issues
- Delete `atc365_radar.db` to reset database
- Restart backend server

## Support

For issues or questions, open an issue on GitHub.
