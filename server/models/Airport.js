import { query } from '../config/database.js';

export async function getAllAirports() {
  const result = await query('SELECT * FROM airports ORDER BY icao');
  return result.rows;
}

export async function getAirportById(id) {
  const result = await query('SELECT * FROM airports WHERE id = $1', [id]);
  return result.rows[0];
}

export async function getAirportByIcao(icao) {
  const result = await query('SELECT * FROM airports WHERE icao = $1', [icao]);
  return result.rows[0];
}

export async function createAirport(airportData) {
  const { icao, iata, name, latitude, longitude, elevation } = airportData;
  const result = await query(
    `INSERT INTO airports (icao, iata, name, latitude, longitude, elevation)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [icao, iata, name, latitude, longitude, elevation]
  );
  return result.rows[0];
}

export async function seedDefaultAirports() {
  const airports = [
    { icao: 'KJFK', iata: 'JFK', name: 'John F. Kennedy International', latitude: 40.6413, longitude: -73.7781, elevation: 13 },
    { icao: 'KLGA', iata: 'LGA', name: 'LaGuardia Airport', latitude: 40.7769, longitude: -73.8740, elevation: 11 },
    { icao: 'KEWR', iata: 'EWR', name: 'Newark Liberty International', latitude: 40.6895, longitude: -74.1745, elevation: 18 },
    { icao: 'KBOS', iata: 'BOS', name: 'Boston Logan International', latitude: 42.3656, longitude: -71.0096, elevation: 14 },
    { icao: 'KORD', iata: 'ORD', name: 'Chicago O\'Hare International', latitude: 41.9742, longitude: -87.9073, elevation: 682 },
    { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International', latitude: 33.9425, longitude: -118.4081, elevation: 125 },
    { icao: 'KDFW', iata: 'DFW', name: 'Dallas/Fort Worth International', latitude: 32.8975, longitude: -97.0382, elevation: 607 },
  ];

  for (const airport of airports) {
    try {
      const existing = await getAirportByIcao(airport.icao);
      if (!existing) {
        await createAirport(airport);
        console.log(`✓ Seeded airport: ${airport.icao}`);
      }
    } catch (error) {
      console.error(`Error seeding airport ${airport.icao}:`, error.message);
    }
  }
}
