import { query } from '../config/database.js';

export function getAllAirspace() {
  const result = query('SELECT * FROM airspace ORDER BY name');
  return result.rows.map(row => ({
    ...row,
    polygon_points: JSON.parse(row.polygon_points || '[]')
  }));
}

export function getAirspaceById(id) {
  const result = query('SELECT * FROM airspace WHERE id = ?', [id]);
  if (result.rows[0]) {
    return {
      ...result.rows[0],
      polygon_points: JSON.parse(result.rows[0].polygon_points || '[]')
    };
  }
  return null;
}

export function createAirspace(airspaceData) {
  const { name, type, floor_altitude, ceiling_altitude, polygon_points } = airspaceData;
  const result = query(
    `INSERT INTO airspace (name, type, floor_altitude, ceiling_altitude, polygon_points)
     VALUES (?, ?, ?, ?, ?)`,
    [name, type, floor_altitude, ceiling_altitude, JSON.stringify(polygon_points)]
  );
  return { id: result.lastID, ...airspaceData };
}

export function seedDefaultAirspace() {
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
      const result = query('SELECT * FROM airspace WHERE name = ?', [airspace.name]);
      if (result.rows.length === 0) {
        createAirspace(airspace);
        console.log(`✓ Seeded airspace: ${airspace.name}`);
      }
    } catch (error) {
      console.error(`Error seeding airspace ${airspace.name}:`, error.message);
    }
  }
}
