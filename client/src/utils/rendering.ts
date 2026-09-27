export function drawRadar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerLat: number,
  centerLng: number,
  zoom: number
) {
  // Draw background
  ctx.fillStyle = '#0a0e27'
  ctx.fillRect(0, 0, width, height)

  // Draw grid/range rings
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)'
  ctx.lineWidth = 1

  const centerX = width / 2
  const centerY = height / 2

  // Draw range rings (10nm circles)
  for (let i = 1; i <= 5; i++) {
    const radius = i * 20 * zoom
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Draw cardinal directions
  ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)'
  ctx.lineWidth = 2

  // North line
  ctx.beginPath()
  ctx.moveTo(centerX, centerY - 100)
  ctx.lineTo(centerX, centerY)
  ctx.stroke()

  // South line
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX, centerY + 100)
  ctx.stroke()

  // East line
  ctx.beginPath()
  ctx.moveTo(centerX + 100, centerY)
  ctx.lineTo(centerX, centerY)
  ctx.stroke()

  // West line
  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(centerX - 100, centerY)
  ctx.stroke()

  // Draw center point
  ctx.fillStyle = '#00ff00'
  ctx.beginPath()
  ctx.arc(centerX, centerY, 3, 0, Math.PI * 2)
  ctx.fill()

  // Draw coordinate text
  ctx.fillStyle = '#00ff00'
  ctx.font = 'bold 12px monospace'
  ctx.fillText(`Center: ${centerLat.toFixed(2)}, ${centerLng.toFixed(2)}`, 10, 40)
  ctx.fillText(`Zoom: ${zoom.toFixed(1)}x`, 10, 55)
}

export function drawAircraft(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  callsign: string,
  heading: number,
  altitude: number
) {
  // Draw aircraft blip
  ctx.fillStyle = '#00ff00'
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, Math.PI * 2)
  ctx.fill()

  // Draw heading line
  ctx.strokeStyle = '#00ff00'
  ctx.lineWidth = 1
  const headingRad = toRad(heading)
  const lineLength = 15

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(
    x + Math.sin(headingRad) * lineLength,
    y - Math.cos(headingRad) * lineLength
  )
  ctx.stroke()

  // Draw label with callsign and altitude
  const label = `${callsign} ${altitude}'`

  ctx.fillStyle = '#00ff00'
  ctx.font = '11px monospace'
  ctx.textAlign = 'left'

  // Draw label with background for readability
  const textWidth = ctx.measureText(label).width
  const padding = 2

  ctx.fillStyle = 'rgba(10, 14, 39, 0.8)'
  ctx.fillRect(
    x + 8,
    y - 10,
    textWidth + padding * 2,
    14
  )

  ctx.fillStyle = '#00ff00'
  ctx.fillText(label, x + 8 + padding, y - 2)
}

export function drawAirspace(
  ctx: CanvasRenderingContext2D,
  polygon: Array<{ lat: number; lng: number }>,
  centerLat: number,
  centerLng: number,
  zoom: number,
  width: number,
  height: number,
  color: string = 'rgba(255, 0, 0, 0.1)'
) {
  ctx.fillStyle = color
  ctx.strokeStyle = color.replace('0.1', '0.5')
  ctx.lineWidth = 2

  const points = polygon.map(p => {
    const pixelsPerDegree = 40 * zoom
    const x = width / 2 + (p.lng - centerLng) * pixelsPerDegree
    const y = height / 2 - (p.lat - centerLat) * pixelsPerDegree
    return [x, y]
  })

  if (points.length > 0) {
    ctx.beginPath()
    ctx.moveTo(points[0][0], points[0][1])

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1])
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
