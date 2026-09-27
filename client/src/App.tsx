import { useEffect, useState } from 'react'
import Radar from './components/Radar'
import ControlPanel from './components/ControlPanel'
import { useWebSocket } from './hooks/useWebSocket'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [airports, setAirports] = useState([])
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null)
  const [centerLat, setCenterLat] = useState(40.7)
  const [centerLng, setCenterLng] = useState(-74.0)
  const [zoom, setZoom] = useState(1)
  const [showAirspace, setShowAirspace] = useState(true)
  const [showGroundRadar, setShowGroundRadar] = useState(false)

  const { connected } = useWebSocket((data) => {
    if (data.type === 'initial' || data.type === 'update') {
      setFlights(data.data)
    }
  })

  useEffect(() => {
    // Fetch airports
    fetch('/api/airports')
      .then(r => r.json())
      .then(setAirports)
      .catch(err => console.error('Error fetching airports:', err))
  }, [])

  const handleAirportSelect = (icao: string) => {
    const airport = airports.find(a => a.icao === icao)
    if (airport) {
      setSelectedAirport(icao)
      setCenterLat(parseFloat(airport.latitude))
      setCenterLng(parseFloat(airport.longitude))
      setZoom(3)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>ATC365 Radar</h1>
        <div className="status">
          <span className={`indicator ${connected ? 'connected' : 'disconnected'}`}></span>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <div className="main-content">
        <div className="radar-container">
          <Radar
            flights={flights}
            centerLat={centerLat}
            centerLng={centerLng}
            zoom={zoom}
            showAirspace={showAirspace}
            showGroundRadar={showGroundRadar}
          />
        </div>

        <ControlPanel
          airports={airports}
          selectedAirport={selectedAirport}
          onAirportSelect={handleAirportSelect}
          zoom={zoom}
          onZoomChange={setZoom}
          showAirspace={showAirspace}
          onToggleAirspace={() => setShowAirspace(!showAirspace)}
          showGroundRadar={showGroundRadar}
          onToggleGroundRadar={() => setShowGroundRadar(!showGroundRadar)}
          flightCount={flights.length}
        />
      </div>
    </div>
  )
}

export default App
