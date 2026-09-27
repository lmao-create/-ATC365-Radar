# ATC365 Radar

A modern, real-time radar visualization system for air traffic control. Display live aircraft positions, manage airspace, and deliver realistic ATC services with a professional interface.

Built with **React**, **Node.js**, and **WebSocket** for real-time updates. **Integrate with any ATC server** - Roblox PTFS, custom systems, or use the included mock data generator for testing.

## ✨ Features

- **Real-time Radar Display**: Live aircraft visualization with 500ms update rate
- **Interactive Controls**: Pan, zoom, and measure distances  
- **Airport Selection**: Quick switching between different airspaces
- **Layer Management**: Toggle airspace boundaries and ground radar
- **Professional UI**: Modern dark theme with authentic ATC styling
- **Server Integration Ready**: Accept flight data via HTTP, WebSocket, or database
- **Mock Data Generator**: Built-in flight simulator for testing
- **Production Ready**: Docker support, scalable architecture

## 🚀 Quick Start

### With Docker (Recommended)

```bash
git clone https://github.com/yourusername/atc365-radar
cd atc365-radar
docker-compose up
```

Open `http://localhost:3000` in your browser.

### Manual Setup

**Prerequisites**: Node.js 18+, npm

**Backend**:
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

**Frontend** (in another terminal):
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`

## 📡 Integration Guide

Integrate your own ATC server with one of these methods:

### Method 1: HTTP POST (Simplest)

Send flight data via HTTP POST:

```bash
curl -X POST http://localhost:3001/api/flights/update \
  -H "Content-Type: application/json" \
  -d '[{
    "callsign": "AAL123",
    "latitude": 40.6413,
    "longitude": -73.7781,
    "altitude": 5000,
    "heading": 180,
    "ground_speed": 450,
    "vertical_speed": 0,
    "squawk": "1234",
    "status": "active"
  }]'
```

### Method 2: WebSocket Direct

Connect your server directly and send updates:

```javascript
const ws = new WebSocket('ws://localhost:3001');
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
```

### Method 3: Database Integration

Store flight data in the backend database directly. The radar will read and display it.

**See [INTEGRATION.md](./INTEGRATION.md) for complete integration guide with examples for Roblox, Python, JavaScript, and more.**

## 🏗️ Architecture

```
Your ATC Server (Roblox/Python/Node/Custom)
         ↓
    Flight Data (HTTP/WebSocket)
         ↓
   Backend Server (Express.js + SQLite)
    ↙              ↖
  WebSocket      REST API
    ↙              ↖
Frontend (React)   External Systems
```

## 📋 Flight Data Format

```typescript
interface FlightData {
  callsign: string;           // e.g., "AAL123"
  latitude: number;           // -90 to 90
  longitude: number;          // -180 to 180
  altitude: number;           // Feet
  heading: number;            // 0-360 degrees
  ground_speed: number;       // Knots
  vertical_speed?: number;    // Feet per minute (optional)
  squawk?: string;            // Transponder code (optional)
  status?: string;            // "active", "landing", etc.
}
```

## 🔧 Configuration

Create `.env` file in `server/`:

```bash
# Server
PORT=3001
NODE_ENV=development

# Optional: Enable flight data endpoint with API key
FLIGHT_ENDPOINT_KEY=your_secret_key_here

# Database
DB_NAME=atc365_radar
```

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/flights` | Get all flights |
| GET | `/api/flights/:callsign` | Get flight by callsign |
| POST | `/api/flights/update` | Update flight positions |
| GET | `/api/airports` | Get all airports |
| POST | `/api/airports` | Add custom airport |
| GET | `/api/airspace` | Get airspace boundaries |

## 📚 Documentation

- **[Integration Guide](./INTEGRATION.md)** - Connect your ATC server
- **[Development Guide](./DEVELOPMENT.md)** - Contribute to the project
- **[Architecture](./docs/ARCHITECTURE.md)** - System design details

## 🛠️ Tech Stack

**Backend**:
- Express.js 4.x
- Node.js 18+
- SQLite
- WebSocket (ws)

**Frontend**:
- React 18.x
- TypeScript
- Canvas API
- Vite

## 📦 Deployment

### Production with Docker

```bash
docker-compose -f docker-compose.yml up -d
```

### Manual Production

```bash
# Backend
cd server
npm ci --only=production
npm start

# Frontend
cd client
npm run build
npm run preview
```

## 🎮 Testing with Mock Data

The system includes a mock flight generator for development and testing:

1. Run the backend (mock data generates automatically)
2. Open the radar UI
3. Flights will appear and update in real-time
4. Use the airport selector to center on different areas

## 🐛 Troubleshooting

**WebSocket connection fails**
- Ensure backend is running on port 3001
- Check firewall settings
- Verify backend URL in frontend configuration

**Flights not displaying**
- Check browser console for errors
- Verify flight data format matches specification
- Ensure callsigns are unique

**Database errors**
- Delete `atc365_radar.db` to reset
- Restart backend server

## 📝 License

MIT License - feel free to use this for commercial or personal projects.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🎯 Roadmap

- [ ] Split-screen center/ground radar
- [ ] Aircraft pinning and highlighting
- [ ] Advanced measuring tool
- [ ] Airport charts integration
- [ ] Multi-controller workstations
- [ ] Conflict detection alerts
- [ ] Audio alerts
- [ ] Recording/playback
- [ ] REST API authentication
- [ ] Database migration tools

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/atc365-radar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/atc365-radar/discussions)

## 🙏 Credits

Inspired by ATC24Radar and professional ATC systems. Built with ❤️ for the flight simulation community.

---

**[Get Started](./INTEGRATION.md)** | **[Documentation](./docs)** | **[Report Issue](https://github.com/yourusername/atc365-radar/issues)**
