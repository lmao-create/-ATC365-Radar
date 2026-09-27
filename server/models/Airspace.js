import { query } from '../config/database.js';

export async function getAllAirspace() {
  const result = await query('SELECT * FROM airspace ORDER BY name');
  return result.rows;
}

export async function getAirspaceById(id) {
  const result = await query('SELECT * FROM airspace WHERE id = $1', [id]);
  return result.rows[0];
}

export async function createAirspace(airspaceData) {
  const { name, type, floor_altitude, ceiling_altitude, polygon_points } = airspaceData;
  const result = await query(
    `INSERT INTO airspace (name, type, floor_altitude, ceiling_altitude, polygon_points)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, type, floor_altitude, ceiling_altitude, JSON.stringify(polygon_points)]
  );
  return result.rows[0];
}

export async function seedDefaultAirspace() {
  const airspaces = [
    {
      name: 'NYC TRACON',
      type: 'TRACON',
      floor_altitude: 1200,
      ceiling_altitude: 10000,
      polygon_points: [
        { lat: 40.5, lng: -74.0 },
        { lat: 41.0, lng: -74.0 },
        { lat: 41.0, lng: -73.5 },
        { lat: 40.5, lng: -73.5 }
      ]
    },
    {
      name: 'JFK Airspace',
      type: 'Airport',
      floor_altitude: 0,
      ceiling_altitude: 5000,
      polygon_points: [
        { lat: 40.6, lng: -73.8 },
        { lat: 40.7, lng: -73.8 },
        { lat: 40.7, lng: -73.7 },
        { lat: 40.6, lng: -73.7 }
      ]
    }
  ];

  for (const airspace of airspaces) {
    try {
      const existing = await query('SELECT * FROM airspace WHERE name = $1', [airspace.name]);
      if (existing.rows.length === 0) {
        await createAirspace(airspace);
        console.log(`✓ Seeded airspace: ${airspace.name}`);
      }
    } catch (error) {
      console.error(`Error seeding airspace ${airspace.name}:`, error.message);
    }
  }
}
