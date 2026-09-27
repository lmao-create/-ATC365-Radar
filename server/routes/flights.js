import express from 'express';
import { getAllFlights, getFlightByCallsign } from '../models/Flight.js';

const router = express.Router();

// Get all flights
router.get('/', async (req, res) => {
  try {
    const flights = await getAllFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get flight by callsign
router.get('/:callsign', async (req, res) => {
  try {
    const flight = await getFlightByCallsign(req.params.callsign);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
