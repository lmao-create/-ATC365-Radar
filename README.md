# ATC365 Radar System

A real-time radar visualization system for air traffic control training on ATC365's private server.

## Features

- **Real-time Radar**: Live aircraft position updates via WebSocket
- **Interactive Controls**: Pan, zoom, and measure distances
- **Airport Selection**: Quick switching between different airspaces
- **Layer Management**: Toggle airspace boundaries and ground radar
- **Mock Data Generator**: Simulated flights for testing and training

## Architecture

### Backend
- **Express.js** - HTTP server and REST API
- **WebSocket** - Real-time data broadcasting
- **PostgreSQL** - Flight and airport data storage
- **Node.js** - Runtime environment

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Canvas API** - High-performance radar rendering
- **Vite** - Build tooling

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm

### Backend Setup

1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Configure your PostgreSQL connection in `.env`

5. Start the server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## Database Setup

The database schema is automatically created on first run. Default airports and airspace are seeded automatically.

### Manual Database Reset (if needed)

Connect to PostgreSQL and run:

```sql
DROP DATABASE IF EXISTS atc365_radar;
CREATE DATABASE atc365_radar;
```

Then restart the server to reinitialize.

## API Endpoints

### Flights
- `GET /api/flights` - Get all flights with current positions
- `GET /api/flights/:callsign` - Get specific flight details

### Airports
- `GET /api/airports` - Get all airports

### Airspace
- `GET /api/airspace` - Get all airspace boundaries

## WebSocket Events

### Server → Client
- `initial` - Initial flight data on connection
- `update` - Periodic position updates (500ms interval)

### Client → Server
- `ping` - Connection health check

## Development

### Project Structure

```
atc365-radar/
├── server/
│   ├── app.js                 - Main Express app
│   ├── config/
│   │   └── database.js        - Database connection
│   ├── models/
│   │   ├── Flight.js
│   │   ├── Airport.js
│   │   └── Airspace.js
│   ├── routes/
│   │   ├── flights.js
│   │   ├── airports.js
│   │   └── airspace.js
│   ├── services/
│   │   ├── websocket.js
│   │   └── flightGenerator.js
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Radar.tsx
    │   │   └── ControlPanel.tsx
    │   ├── hooks/
    │   │   └── useWebSocket.ts
    │   ├── utils/
    │   │   ├── coordinate.ts
    │   │   └── rendering.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── index.html
    └── package.json
```

## Performance Notes

- Radar updates at 500ms interval from server
- Canvas rendering optimized for 50+ concurrent aircraft
- WebSocket connection auto-reconnects on disconnect
- Coordinate system uses simple Mercator-like projection

## Troubleshooting

### WebSocket Connection Failed
- Ensure backend server is running on port 3001
- Check firewall settings
- Verify CORS configuration in Express

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` database credentials
- Ensure database exists or server can create it

### Aircraft Not Displaying
- Check browser console for errors
- Verify flights are being generated (check server logs)
- Check zoom level and center coordinates

## Future Features

- [ ] Split-screen center/ground radar
- [ ] Aircraft pinning and highlighting
- [ ] Advanced measuring tool
- [ ] Airport charts integration
- [ ] Multiple controller workstations
- [ ] Flight plan integration
- [ ] Conflict detection
- [ ] Audio alerts

## License

MIT
