import express from 'express';
import { getAllAirspace, seedDefaultAirspace } from '../models/Airspace.js';

const router = express.Router();

// Get all airspace
router.get('/', (req, res) => {
  try {
    let airspaces = getAllAirspace();

    // Seed if empty
    if (airspaces.length === 0) {
      seedDefaultAirspace();
      airspaces = getAllAirspace();
    }

    res.json(airspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
