import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const db = new Database('../atc365_radar.db');
db.pragma('journal_mode = WAL');

export function initializeDatabase() {
  try {
    const result = db.prepare('SELECT 1').get();
    console.log('✓ Database connected (SQLite)');
    createTables();
    seedInitialData();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

function seedInitialData() {
  try {
    // Check if airports exist
    const airportCount = db.prepare('SELECT COUNT(*) as count FROM airports').get();
    if (airportCount.count === 0) {
      // Seed airports directly
      const airports = [
        { icao: 'KJFK', iata: 'JFK', name: 'John F. Kennedy International', latitude: 40.6413, longitude: -73.7781, elevation: 13 },
        { icao: 'KLGA', iata: 'LGA', name: 'LaGuardia Airport', latitude: 40.7769, longitude: -73.8740, elevation: 11 },
        { icao: 'KEWR', iata: 'EWR', name: 'Newark Liberty International', latitude: 40.6895, longitude: -74.1745, elevation: 18 },
        { icao: 'KBOS', iata: 'BOS', name: 'Boston Logan International', latitude: 42.3656, longitude: -71.0096, elevation: 14 },
        { icao: 'KORD', iata: 'ORD', name: 'Chicago O\'Hare International', latitude: 41.9742, longitude: -87.9073, elevation: 682 },
        { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International', latitude: 33.9425, longitude: -118.4081, elevation: 125 },
        { icao: 'KDFW', iata: 'DFW', name: 'Dallas/Fort Worth International', latitude: 32.8975, longitude: -97.0382, elevation: 607 },
      ];

      const stmt = db.prepare('INSERT INTO airports (icao, iata, name, latitude, longitude, elevation) VALUES (?, ?, ?, ?, ?, ?)');
      for (const airport of airports) {
        stmt.run(airport.icao, airport.iata, airport.name, airport.latitude, airport.longitude, airport.elevation);
      }
      console.log(`✓ Seeded ${airports.length} airports`);
    }
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
}

function createTables() {
  const queries = [
    // Airports
    `CREATE TABLE IF NOT EXISTS airports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      icao TEXT UNIQUE NOT NULL,
      iata TEXT,
      name TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      elevation INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Flights
    `CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      callsign TEXT UNIQUE NOT NULL,
      aircraft_type TEXT,
      origin_id INTEGER REFERENCES airports(id),
      destination_id INTEGER REFERENCES airports(id),
      filed_altitude INTEGER,
      route TEXT,
      status TEXT DEFAULT 'planning',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Aircraft (current positions)
    `CREATE TABLE IF NOT EXISTS aircraft (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      flight_id INTEGER UNIQUE REFERENCES flights(id),
      callsign TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      altitude INTEGER,
      heading REAL,
      ground_speed INTEGER,
      vertical_speed INTEGER,
      squawk TEXT,
      status TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    // Airspace boundaries
    `CREATE TABLE IF NOT EXISTS airspace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      floor_altitude INTEGER,
      ceiling_altitude INTEGER,
      polygon_points TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
  ];

  for (const query of queries) {
    try {
      db.exec(query);
    } catch (error) {
      console.error('Error creating table:', error.message);
    }
  }

  console.log('✓ Database tables ready');
}

export function getDb() {
  return db;
}

export function query(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      if (params.length > 0) {
        return { rows: stmt.all(...params) };
      }
      return { rows: stmt.all() };
    } else {
      const result = stmt.run(...params);
      return { lastID: result.lastInsertRowid, changes: result.changes };
    }
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
}
