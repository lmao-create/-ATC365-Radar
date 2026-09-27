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
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3>Airport</h3>
        <select
          value={selectedAirport || ''}
          onChange={(e) => e.target.value && onAirportSelect(e.target.value)}
          className="airport-select"
        >
          <option value="">Select Airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.icao}>
              {airport.icao} - {airport.name}
            </option>
          ))}
        </select>
      </div>

      <div className="panel-section">
        <h3>View</h3>
        <div className="zoom-control">
          <button onClick={() => onZoomChange(Math.max(0.5, zoom - 0.5))}>
            Zoom Out
          </button>
          <span>{zoom.toFixed(1)}x</span>
          <button onClick={() => onZoomChange(Math.min(3, zoom + 0.5))}>
            Zoom In
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h3>Layers</h3>
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
        <h3>Tools</h3>
        <button className="tool-btn">Measure</button>
        <button className="tool-btn">Pin Aircraft</button>
        <button className="tool-btn">Charts</button>
      </div>

      <div className="panel-section info">
        <h3>Info</h3>
        <p className="info-item">Connected: Yes</p>
        <p className="info-item">Format: Digital Radar</p>
      </div>
    </div>
  )
}
