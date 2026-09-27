# ATC365 Radar - Roblox Integration

A professional real-time radar system for Roblox PTFS (Pilot Training Flight Simulator) servers. Display live aircraft positions with a polished ATC interface.

## 🚀 Quick Start

### 1. Backend Setup

```bash
git clone https://github.com/yourusername/atc365-radar
cd atc365-radar/server
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Roblox Server Integration

Add this Lua script to your Roblox PTFS server:

```lua
-- Place this in ServerScriptService
local HttpService = game:GetService("HttpService")
local BACKEND_URL = "http://localhost:3001/api/flights/update"
local UPDATE_INTERVAL = 0.5 -- 500ms

-- Get all active flights from your game
local function getActiveFlights()
    local flights = {}
    
    -- Replace this with your actual flight data logic
    -- Example: iterate through your game's aircraft/flight objects
    for _, aircraft in pairs(game.Workspace:FindDescendants()) do
        if aircraft:FindFirstChild("FlightData") then
            local data = aircraft.FlightData
            table.insert(flights, {
                callsign = data.Callsign.Value,
                latitude = data.Latitude.Value,
                longitude = data.Longitude.Value,
                altitude = data.Altitude.Value,
                heading = data.Heading.Value,
                ground_speed = data.Speed.Value,
                vertical_speed = data.VerticalSpeed.Value or 0,
                squawk = data.Squawk.Value or "1200",
                status = data.Status.Value or "active"
            })
        end
    end
    
    return flights
end

-- Send flight data to radar backend
local function updateRadar()
    local flights = getActiveFlights()
    
    if #flights > 0 then
        local success, response = pcall(function()
            return HttpService:PostAsync(
                BACKEND_URL,
                HttpService:JSONEncode(flights),
                Enum.HttpContentType.ApplicationJson
            )
        end)
        
        if success then
            print("✓ Updated radar with " .. #flights .. " flights")
        else
            print("✗ Failed to update radar: " .. tostring(response))
        end
    end
end

-- Update radar every 500ms
while true do
    wait(UPDATE_INTERVAL)
    updateRadar()
end
```

## 📋 Flight Data Format

Your Roblox script should send data in this format:

```lua
{
    callsign = "AAL123",        -- Callsign
    latitude = 40.6413,         -- Latitude (-90 to 90)
    longitude = -73.7781,       -- Longitude (-180 to 180)
    altitude = 5000,            -- Altitude (feet)
    heading = 180,              -- Heading (0-360 degrees)
    ground_speed = 450,         -- Ground speed (knots)
    vertical_speed = 0,         -- Vertical speed (fpm, optional)
    squawk = "1234",            -- Squawk code (optional)
    status = "active"           -- Status (optional)
}
```

## 🛠️ Backend API

### Health Check
```bash
GET http://localhost:3001/health
```

### Get All Flights
```bash
GET http://localhost:3001/api/flights
```

### Send Flight Data (from Roblox)
```bash
POST http://localhost:3001/api/flights/update
Content-Type: application/json

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

## 🔧 Configuration

Create `.env` file in `server/`:

```bash
PORT=3001
NODE_ENV=development
DB_NAME=atc365_radar
```

## 📚 How It Works

```
Roblox PTFS Server
       ↓
   (Lua Script)
       ↓
  HTTP POST (500ms)
       ↓
Backend (Node.js)
       ↓
  WebSocket Broadcast
       ↓
Frontend (React)
       ↓
  Live Radar Display
```

## ✨ Features

- **Real-time Updates**: 500ms refresh rate
- **Interactive Radar**: Pan, zoom, measure distances
- **Professional UI**: Dark ATC theme
- **Airport Selection**: Switch between airspaces
- **Mock Data**: Test without Roblox server

## 📦 Docker Deployment

```bash
docker-compose up
```

Runs on `http://localhost:3000` (frontend) and `http://localhost:3001` (backend)

## 🎮 Testing Without Roblox

The radar includes a mock flight generator. Just run the backend and frontend - it will automatically generate 6 test flights that update in real-time.

## 🐛 Troubleshooting

**"WebSocket connection failed"**
- Ensure backend is running: `npm run dev` in server directory
- Check port 3001 is not blocked by firewall

**"Flights not showing"**
- Check Roblox script is sending data correctly
- Use browser DevTools to verify API calls
- Check backend logs for errors

**"Radar freezes or lags"**
- Reduce update frequency in Roblox script (increase `UPDATE_INTERVAL`)
- Check network connection
- Monitor backend CPU usage

## 📝 License

MIT License

## 🤝 Support

- **Issues**: Report via GitHub Issues
- **Questions**: Post in GitHub Discussions

---

Built specifically for Roblox PTFS servers. ✈️
