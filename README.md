# ATC365 Radar

A professional real-time radar system for Roblox PTFS (Pilot Training Flight Simulator) servers.

Display live aircraft positions from your Roblox server with a polished ATC interface. Built with React, Node.js, and WebSocket for real-time updates.

## ✨ Features

- **Real-time Radar**: 500ms update rate from Roblox server
- **Interactive Display**: Pan, zoom, and measure distances
- **Professional UI**: Modern dark theme with authentic ATC styling
- **Airport Selection**: Switch between different airspaces
- **Easy Integration**: Simple Lua script for Roblox servers
- **Mock Data**: Test without Roblox server

## 🚀 Quick Start

### 1. Start Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on `http://localhost:3001`

### 2. Start Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Integrate Roblox Server

Add this Lua script to your **Roblox PTFS server** (in ServerScriptService):

```lua
-- ATC365 Radar Integration
local HttpService = game:GetService("HttpService")
local BACKEND_URL = "http://localhost:3001/api/flights/update"
local UPDATE_INTERVAL = 0.5 -- 500ms

local function getActiveFlights()
    local flights = {}
    
    -- Replace with your flight data logic
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

while true do
    wait(UPDATE_INTERVAL)
    local flights = getActiveFlights()
    
    if #flights > 0 then
        pcall(function()
            HttpService:PostAsync(
                BACKEND_URL,
                HttpService:JSONEncode(flights),
                Enum.HttpContentType.ApplicationJson
            )
        end)
    end
end
```

Done! Open `http://localhost:3000` to see your radar.

## 📡 How It Works

```
Roblox Server (Lua Script)
        ↓
  HTTP POST (Flight Data)
        ↓
   Backend (Node.js)
        ↓
   WebSocket Broadcast
        ↓
  Frontend (React)
        ↓
   Live Radar Display
```

## 📋 Flight Data Format

Your Roblox script sends:

```lua
{
    callsign = "AAL123",        -- Flight callsign
    latitude = 40.6413,         -- Latitude
    longitude = -73.7781,       -- Longitude
    altitude = 5000,            -- Feet
    heading = 180,              -- Degrees (0-360)
    ground_speed = 450,         -- Knots
    vertical_speed = 0,         -- FPM (optional)
    squawk = "1234",            -- Transponder (optional)
    status = "active"           -- Status (optional)
}
```

## 🛠️ Tech Stack

- **Backend**: Express.js + Node.js + SQLite + WebSocket
- **Frontend**: React + TypeScript + Canvas
- **Integration**: Roblox Lua HTTP API

## 📦 Docker

```bash
docker-compose up
```

Runs on `http://localhost:3000`

## 🎮 Testing

Run without Roblox server - mock data automatically generates 6 test flights.

## 🐛 Troubleshooting

**WebSocket not connecting**
- Backend must be running on port 3001
- Check firewall settings

**No flights showing**
- Verify Roblox script is sending data
- Check browser console for errors
- Ensure Roblox server is running

**Data not updating**
- Check `UPDATE_INTERVAL` in Roblox script
- Verify flight data format matches specification

## 📝 License

MIT

## 🔗 Links

- **[Integration Guide](./INTEGRATION.md)** - Detailed Roblox setup
- **[Issues](https://github.com/lmao-create/-ATC365-Radar/issues)** - Report bugs

---

Built for Roblox PTFS servers. ✈️
