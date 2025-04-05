export const TABLES = {
    users: `
      CREATE TABLE IF NOT EXISTS Users (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        email_address TEXT,
        password TEXT,
        is_admin INTEGER
      )
    `,
    news: `
      CREATE TABLE IF NOT EXISTS News (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        content TEXT,
        raw_content TEXT,
        created_at TEXT,
        last_edited TEXT
      )
    `,
    pages: `
      CREATE TABLE IF NOT EXISTS Pages (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        content TEXT,
        raw_content TEXT
      )
    `
  };
  