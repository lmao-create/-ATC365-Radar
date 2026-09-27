import { query } from '../config/database.js';

export function getAllFlights() {
  const result = query(`
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

export function getFlightByCallsign(callsign) {
  const result = query(
    `SELECT f.*, a.* FROM flights f
     LEFT JOIN aircraft a ON f.id = a.flight_id
     WHERE f.callsign = ?`,
    [callsign]
  );
  return result.rows[0];
}

export function updateAircraftPosition(callsign, position) {
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

  query(
    `UPDATE aircraft
     SET latitude = ?, longitude = ?, altitude = ?, heading = ?,
         ground_speed = ?, vertical_speed = ?, squawk = ?,
         status = ?, updated_at = CURRENT_TIMESTAMP
     WHERE callsign = ?`,
    [latitude, longitude, altitude, heading, ground_speed, vertical_speed, squawk, status, callsign]
  );
}

export function createFlight(flightData) {
  const { callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status } = flightData;

  const result = query(
    `INSERT INTO flights (callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [callsign, aircraft_type, origin_id, destination_id, filed_altitude, route, status]
  );

  return { id: result.lastID, ...flightData };
}

export function createAircraft(flightId, callsign, initialPosition) {
  const result = query(
    `INSERT INTO aircraft (flight_id, callsign, latitude, longitude, altitude, heading, ground_speed, vertical_speed, squawk, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [flightId, callsign, initialPosition.latitude, initialPosition.longitude, initialPosition.altitude || 0,
     initialPosition.heading || 0, initialPosition.ground_speed || 0, initialPosition.vertical_speed || 0,
     initialPosition.squawk || '1200', 'active']
  );

  return { id: result.lastID, ...initialPosition };
}
