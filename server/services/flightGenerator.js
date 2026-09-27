import { createFlight, createAircraft, updateAircraftPosition, getAllFlights } from '../models/Flight.js';
import { getAllAirports } from '../models/Airport.js';
import { v4 as uuidv4 } from 'uuid';

const callsignPrefixes = ['AAL', 'UAL', 'DAL', 'SWA', 'JBU', 'SKW', 'ASA', 'VIR', 'FDX', 'UPS'];
const aircraftTypes = ['B737', 'A320', 'B777', 'A350', 'CRJ9', 'E175', 'B787', 'A330'];

let activeFlights = [];
let generatorInterval;

export function startFlightGenerator() {
  console.log('Starting flight generator...');

  // Initial seed of flights
  seedInitialFlights();

  // Update positions every 500ms
  generatorInterval = setInterval(() => {
    updateAllFlights();
  }, 500);
}

export function stopFlightGenerator() {
  if (generatorInterval) {
    clearInterval(generatorInterval);
  }
}

function seedInitialFlights() {
  try {
    const airports = getAllAirports();
    const existingFlights = getAllFlights();

    if (!airports || airports.length === 0) {
      console.log('No airports available, skipping flight generation');
      return;
    }

    if (existingFlights.length > 0) {
      console.log(`✓ Found ${existingFlights.length} existing flights`);
      activeFlights = existingFlights.map(f => ({
        callsign: f.callsign,
        flightId: f.id,
        origin: f.origin,
        destination: f.destination
      }));
      return;
    }

    // Create 5-10 initial flights
    const numFlights = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < numFlights; i++) {
      const callsign = generateCallsign();
      const origin = airports[Math.floor(Math.random() * airports.length)];
      const destination = airports[Math.floor(Math.random() * airports.length)];

      if (!origin || !destination || origin.id === destination.id) continue;

      const flight = createFlight({
        callsign,
        aircraft_type: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
        origin_id: origin.id,
        destination_id: destination.id,
        filed_altitude: Math.floor(Math.random() * 35000) + 1000,
        route: 'SID STAR',
        status: 'active'
      });

      // Create initial position near origin airport
      const initialPos = {
        latitude: origin.latitude + (Math.random() - 0.5) * 0.1,
        longitude: origin.longitude + (Math.random() - 0.5) * 0.1,
        altitude: Math.floor(Math.random() * 5000),
        heading: Math.random() * 360,
        ground_speed: Math.floor(Math.random() * 300) + 100,
        vertical_speed: Math.floor(Math.random() * 2000) - 1000,
        squawk: generateSquawk()
      };

      createAircraft(flight.id, callsign, initialPos);

      activeFlights.push({
        callsign,
        flightId: flight.id,
        origin: origin.icao,
        destination: destination.icao
      });

      console.log(`✓ Created flight ${callsign}: ${origin.icao} → ${destination.icao}`);
    }
  } catch (error) {
    console.error('Error seeding flights:', error.message);
  }
}

function updateAllFlights() {
  for (const flight of activeFlights) {
    try {
      const heading = Math.random() * 360;
      const speed = Math.floor(Math.random() * 300) + 200;
      const verticalSpeed = Math.floor(Math.random() * 2000) - 1000;

      // Small random walk for position
      const latDelta = (Math.random() - 0.5) * 0.001;
      const lngDelta = (Math.random() - 0.5) * 0.001;

      updateAircraftPosition(flight.callsign, {
        latitude: 40.7 + latDelta,
        longitude: -74.0 + lngDelta,
        altitude: Math.floor(Math.random() * 35000),
        heading,
        ground_speed: speed,
        vertical_speed: verticalSpeed,
        squawk: Math.random() > 0.9 ? generateSquawk() : '1200',
        status: 'active'
      });
    } catch (error) {
      console.error(`Error updating flight ${flight.callsign}:`, error.message);
    }
  }
}

function generateCallsign() {
  const prefix = callsignPrefixes[Math.floor(Math.random() * callsignPrefixes.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${number}`;
}

function generateSquawk() {
  return Math.floor(Math.random() * 8000).toString().padStart(4, '0');
}
