import express from 'express';
import { updateAircraftPosition, getAllFlights } from '../models/Flight.js';

const router = express.Router();

// Middleware to check API key (optional)
const checkApiKey = (req, res, next) => {
  const apiKey = process.env.FLIGHT_ENDPOINT_KEY;
  if (!apiKey) {
    return next(); // No key required if not configured
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const key = authHeader.substring(7);
  if (key !== apiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

// Get all flights
router.get('/', (req, res) => {
  try {
    const flights = getAllFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flight by callsign
router.get('/:callsign', (req, res) => {
  try {
    const { query } = require('../models/Flight.js');
    const result = query(
      `SELECT f.*, a.* FROM flights f
       LEFT JOIN aircraft a ON f.id = a.flight_id
       WHERE f.callsign = ?`,
      [req.params.callsign]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update flight data (for external integrations)
router.post('/update', checkApiKey, (req, res) => {
  try {
    const flights = Array.isArray(req.body) ? req.body : [req.body];

    if (!Array.isArray(flights)) {
      return res.status(400).json({ error: 'Expected array of flights' });
    }

    let updated = 0;
    let errors = [];

    for (const flight of flights) {
      try {
        if (!flight.callsign) {
          errors.push('Missing callsign');
          continue;
        }

        updateAircraftPosition(flight.callsign, {
          latitude: flight.latitude || 0,
          longitude: flight.longitude || 0,
          altitude: flight.altitude || 0,
          heading: flight.heading || 0,
          ground_speed: flight.ground_speed || 0,
          vertical_speed: flight.vertical_speed || 0,
          squawk: flight.squawk || '1200',
          status: flight.status || 'active'
        });
        updated++;
      } catch (error) {
        errors.push(`${flight.callsign}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      updated,
      errors: errors.length > 0 ? errors : undefined,
      total: flights.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
