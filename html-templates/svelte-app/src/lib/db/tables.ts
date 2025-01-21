export const TABLES = {
    users: `
      CREATE TABLE IF NOT EXISTS Users (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        surname TEXT,
        email_address TEXT,
        password TEXT,
        birthdate TEXT,
        sex INTEGER,
        created_at TEXT,
        last_active TEXT,
        is_admin INTEGER
      )
    `,
    competitions: `
      CREATE TABLE IF NOT EXISTS Competitions (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        location TEXT,
        bulletin_path TEXT,
        cost REAL,
        date TEXT,
        time TEXT,
        is_foreign INTEGER
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
    competitionApplications: `
      CREATE TABLE IF NOT EXISTS CompetitionApplications (
        pk_id INTEGER PRIMARY KEY AUTOINCREMENT,
        fk_competition_id INTEGER,
        fk_user_id INTEGER,
        name TEXT,
        surname TEXT,
        email_address TEXT,
        phone_number TEXT,
        parent_name TEXT,
        parent_surname TEXT,
        parent_phone_number TEXT
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
  