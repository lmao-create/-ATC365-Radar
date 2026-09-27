// Convert latitude/longitude to pixel coordinates
export function latLngToPixel(
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
): [number, number] {
  // Simple Mercator-like projection
  const pixelsPerDegree = 40 * zoom

  const x = canvasWidth / 2 + (lng - centerLng) * pixelsPerDegree
  const y = canvasHeight / 2 - (lat - centerLat) * pixelsPerDegree

  return [x, y]
}

// Convert pixel coordinates to latitude/longitude
export function pixelToLatLng(
  x: number,
  y: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  canvasWidth: number,
  canvasHeight: number
): [number, number] {
  const pixelsPerDegree = 40 * zoom

  const lng = centerLng + (x - canvasWidth / 2) / pixelsPerDegree
  const lat = centerLat - (y - canvasHeight / 2) / pixelsPerDegree

  return [lat, lng]
}

// Calculate distance between two lat/lng points in nautical miles
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3440.065 // Earth's radius in nautical miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}
