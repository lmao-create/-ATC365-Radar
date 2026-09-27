import { useEffect, useRef } from 'react'
import { latLngToPixel, pixelToLatLng } from '../utils/coordinate'
import { drawRadar, drawAircraft } from '../utils/rendering'
import './Radar.css'

interface RadarProps {
  flights: any[]
  centerLat: number
  centerLng: number
  zoom: number
  showAirspace: boolean
  showGroundRadar: boolean
}

export default function Radar({
  flights,
  centerLat,
  centerLng,
  zoom,
  showAirspace,
  showGroundRadar,
}: RadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const container = containerRef.current
    if (!container) return

    // Set canvas size to container
    const width = container.clientWidth
    const height = container.clientHeight
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#0a0e27'
    ctx.fillRect(0, 0, width, height)

    // Draw radar background
    drawRadar(ctx, width, height, centerLat, centerLng, zoom)

    // Draw aircraft
    flights.forEach((flight) => {
      if (flight.latitude && flight.longitude) {
        const [x, y] = latLngToPixel(
          flight.latitude,
          flight.longitude,
          centerLat,
          centerLng,
          zoom,
          width,
          height
        )

        // Only draw if on screen
        if (x > 0 && x < width && y > 0 && y < height) {
          drawAircraft(ctx, x, y, flight.callsign, flight.heading || 0, flight.altitude || 0)
        }
      }
    })

    // Draw flight count
    ctx.fillStyle = '#00ff00'
    ctx.font = '12px monospace'
    ctx.fillText(`Flights: ${flights.length}`, 10, 20)
  }, [flights, centerLat, centerLng, zoom, showAirspace, showGroundRadar])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const [lat, lng] = pixelToLatLng(
      x,
      y,
      centerLat,
      centerLng,
      zoom,
      canvas.width,
      canvas.height
    )

    console.log(`Clicked at: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
  }

  return (
    <div className="radar" ref={containerRef}>
      <canvas
        ref={canvasRef}
        className="radar-canvas"
        onClick={handleCanvasClick}
      />
    </div>
  )
}
