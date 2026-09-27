import express from 'express';
import { getAllAirspace, seedDefaultAirspace } from '../models/Airspace.js';

const router = express.Router();

// Get all airspace
router.get('/', async (req, res) => {
  try {
    let airspaces = await getAllAirspace();

    // Seed if empty
    if (airspaces.length === 0) {
      await seedDefaultAirspace();
      airspaces = await getAllAirspace();
    }

    res.json(airspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
