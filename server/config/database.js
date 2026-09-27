import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'atc365_radar',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

export async function initializeDatabase() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0].now);
    await createTables();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

async function createTables() {
  const queries = [
    // Airports
    `CREATE TABLE IF NOT EXISTS airports (
      id SERIAL PRIMARY KEY,
      icao VARCHAR(4) UNIQUE NOT NULL,
      iata VARCHAR(3),
      name VARCHAR(100) NOT NULL,
      latitude DECIMAL(10, 6) NOT NULL,
      longitude DECIMAL(10, 6) NOT NULL,
      elevation INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Flights
    `CREATE TABLE IF NOT EXISTS flights (
      id SERIAL PRIMARY KEY,
      callsign VARCHAR(10) UNIQUE NOT NULL,
      aircraft_type VARCHAR(20),
      origin_id INTEGER REFERENCES airports(id),
      destination_id INTEGER REFERENCES airports(id),
      filed_altitude INTEGER,
      route TEXT,
      status VARCHAR(20) DEFAULT 'planning',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Aircraft (current positions)
    `CREATE TABLE IF NOT EXISTS aircraft (
      id SERIAL PRIMARY KEY,
      flight_id INTEGER UNIQUE REFERENCES flights(id),
      callsign VARCHAR(10) NOT NULL,
      latitude DECIMAL(10, 6) NOT NULL,
      longitude DECIMAL(10, 6) NOT NULL,
      altitude INTEGER,
      heading DECIMAL(5, 2),
      ground_speed INTEGER,
      vertical_speed INTEGER,
      squawk VARCHAR(4),
      status VARCHAR(20),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Airspace boundaries
    `CREATE TABLE IF NOT EXISTS airspace (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      type VARCHAR(20),
      floor_altitude INTEGER,
      ceiling_altitude INTEGER,
      polygon_points JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Create indices
    `CREATE INDEX IF NOT EXISTS idx_aircraft_callsign ON aircraft(callsign);`,
    `CREATE INDEX IF NOT EXISTS idx_flights_callsign ON flights(callsign);`,
    `CREATE INDEX IF NOT EXISTS idx_aircraft_updated_at ON aircraft(updated_at);`
  ];

  for (const query of queries) {
    try {
      await pool.query(query);
    } catch (error) {
      console.error('Error creating table:', error.message);
    }
  }

  console.log('✓ Database tables ready');
}

export function getPool() {
  return pool;
}

export async function query(text, params) {
  return pool.query(text, params);
}
