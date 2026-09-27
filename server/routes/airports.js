import express from 'express';
import { getAllAirports, getAirportById, seedDefaultAirports } from '../models/Airport.js';

const router = express.Router();

// Get all airports
router.get('/', (req, res) => {
  try {
    let airports = getAllAirports();

    // Seed if empty
    if (airports.length === 0) {
      seedDefaultAirports();
      airports = getAllAirports();
    }

    res.json(airports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get airport by ID
router.get('/:id', (req, res) => {
  try {
    const airport = getAirportById(parseInt(req.params.id));
    if (!airport) {
      return res.status(404).json({ error: 'Airport not found' });
    }
    res.json(airport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
