import './ControlPanel.css'

interface ControlPanelProps {
  airports: any[]
  selectedAirport: string | null
  onAirportSelect: (icao: string) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  showAirspace: boolean
  onToggleAirspace: () => void
  showGroundRadar: boolean
  onToggleGroundRadar: () => void
  flightCount?: number
}

export default function ControlPanel({
  airports,
  selectedAirport,
  onAirportSelect,
  zoom,
  onZoomChange,
  showAirspace,
  onToggleAirspace,
  showGroundRadar,
  onToggleGroundRadar,
  flightCount = 0,
}: ControlPanelProps) {
  const selectedAirportData = airports.find(a => a.icao === selectedAirport)

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>🛫 Airport</h3>
        <select
          value={selectedAirport || ''}
          onChange={(e) => e.target.value && onAirportSelect(e.target.value)}
          className="airport-select"
        >
          <option value="">Select Airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.icao}>
              {airport.icao} — {airport.iata}
            </option>
          ))}
        </select>
        {selectedAirportData && (
          <div className="info-item" style={{ marginTop: '0.5rem' }}>
            <strong>{selectedAirportData.name}</strong><br />
            Elev: {selectedAirportData.elevation} ft
          </div>
        )}
      </div>

      <div className="panel-section">
        <h3>🔍 View</h3>
        <div className="zoom-control">
          <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.5))}>
            −
          </button>
          <span>{zoom.toFixed(1)}×</span>
          <button onClick={() => onZoomChange(Math.min(3, zoom + 0.5))}>
            +
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>📊 Layers</h3>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showAirspace}
            onChange={onToggleAirspace}
          />
          <span>Airspace</span>
        </label>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showGroundRadar}
            onChange={onToggleGroundRadar}
          />
          <span>Ground Radar</span>
        </label>
      </div>

      <div className="panel-section">
        <h3>⚙️ Tools</h3>
        <button className="tool-btn">📏 Measure</button>
        <button className="tool-btn">📌 Pin Aircraft</button>
        <button className="tool-btn">📄 Charts</button>
      </div>

      <div className="panel-section info">
        <h3>ℹ️ Status</h3>
        <div className="info-item">
          <strong>Aircraft:</strong> {flightCount}
        </div>
        <div className="info-item">
          <strong>Format:</strong> Digital Radar
        </div>
        <div className="info-item">
          <strong>Update Rate:</strong> 500ms
        </div>
        <div className="info-item">
          <strong>Data:</strong> Mock Flight Data
        </div>
      </div>
    </div>
  )
}
