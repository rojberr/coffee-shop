import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { TABLES } from './tables';
import { addAdminUser, ensureDefaultPages } from './seeds';

// Otwieranie połączenia z bazą danych
const db = new sqlite3.Database('db.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    throw err;
  } else {
    console.log('[DATABASE] Connected to the SQLite database.');
  }
});

// Funkcja do tworzenia tabel
const createTables = async () => {
  // Poprawne typowanie dla db.run
  // const run = promisify((sql: string, params?: any[], callback?: (err: Error | null) => void) => {
  //   console.log(`[DATABASE] Running query: ${sql}`);
  //   db.run(sql, params, callback)
  // }) as (sql: string, params?: any[]) => Promise<void>;

  // const get = promisify((sql: string, params?: any[], callback?: (err: Error | null, row?: any) => void) => {
  //   console.log(`[DATABASE] Getting query: ${sql}`);
  //   db.get(sql, params, callback)
  // }) as (sql: string, params?: any[]) => Promise<any>;

  // Iteracyjne tworzenie tabel
  for (const [tableName, query] of Object.entries(TABLES)) {
    console.log(`[DATABASE] Preparing to create table: ${tableName}`);
    try {
      db.run(query)
      console.log(`[DATABASE] ${tableName} table ensured.`);
    } catch (err) {
      console.error(`Error creating ${tableName} table:`, err);
      throw err;
    }
  }

  // Dodanie domyślnych rekordów do tabeli Pages
  await addAdminUser(db);
  await ensureDefaultPages(db);
};

// Uruchomienie funkcji tworzenia tabel
console.log('creating');
createTables().catch((err) => {
  console.error('Error initializing database:', err);
});

export default db;
