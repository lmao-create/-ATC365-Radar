import { query } from '../config/database.js';

export async function getAllFlights() {
  const result = await query(`
    SELECT
      f.id,
      f.callsign,
      f.aircraft_type,
      f.status,
      f.filed_altitude,
      f.route,
      a.latitude,
      a.longitude,
      a.altitude,
      a.heading,
      a.ground_speed,
      a.vertical_speed,
      a.squawk,
      orig.icao as origin,
      dest.icao as destination
    FROM flights f
    LEFT JOIN aircraft a ON f.id = a.flight_id
    LEFT JOIN airports orig ON f.origin_id = orig.id
    LEFT JOIN airports dest ON f.destination_id = dest.id
    ORDER BY f.callsign
  `);
  return result.rows;
}

export async function getFlightByCallsign(callsign) {
  const result = await query(
    `SELECT f.*, a.* FROM flights f
     LEFT JOIN aircraft a ON f.id = a.flight_id
     WHERE f.callsign = $1`,
    [callsign]
  );
  return result.rows[0];
}

export async function updateAircraftPosition(callsign, position) {
  const {
    latitude,
    longitude,
    altitude,
    heading,
    ground_speed,
    vertical_speed,
    squawk,
    status
  } = position;

  await query(
    `UPDATE aircraft
     SET latitude = $1, longitude = $2, altitude = $3, heading = $4,
         ground_speed = $5, vertical_speed = $6, squawk = $7,
         status = $8, updated_at = CURRENT_TIMESTAMP
     WHERE callsign = $9`,
    [latitude, longitude, altitude, heading, ground_speed, vertical_speed, squawk, status, callsign]
  );
}

export async function createFlight(flightData) {
  const { callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status } = flightData;

  const result = await query(
    `INSERT INTO flights (callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status]
  );

  return result.rows[0];
}

export async function createAircraft(flightId, callsign, initialPosition) {
  const result = await query(
    `INSERT INTO aircraft (flight_id, callsign, latitude, longitude, altitude, heading, ground_speed, vertical_speed, squawk, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [flightId, callsign, initialPosition.latitude, initialPosition.longitude, initialPosition.altitude || 0,
     initialPosition.heading || 0, initialPosition.ground_speed || 0, initialPosition.vertical_speed || 0,
     initialPosition.squawk || '1200', 'active']
  );

  return result.rows[0];
}
