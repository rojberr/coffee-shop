import bcrypt from 'bcrypt';
import type { Database } from 'sqlite3'
import dotenv from 'dotenv';
dotenv.config();

function formatDateToSQLite(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

export const ensureDefaultPages = async (db: Database) => {
    const pages = [
      { name: 'about', content: '{"ops":[{"insert":"O nas"}]}', raw_content: 'O nas' },
      { name: 'contact', content: '{"ops":[{"insert":"Kontakt"}]}', raw_content: 'Kontakt' }
    ];
  
    for (const page of pages) {
      try {
        // Wstaw domyślne strony, jeśli jeszcze ich nie ma
        db.run(
          `
          INSERT INTO Pages (name, content)
          SELECT ?, ?
          WHERE NOT EXISTS (
            SELECT 1 FROM Pages WHERE name = ?
          )
          `,
          [page.name, page.content, page.name]
        );
        console.log(`[DATABASE] Default page "${page.name}" ensured.`);
      } catch (err) {
        console.error(`Error inserting default page "${page.name}":`, err);
      }
    }
  };

  export const addAdminUser = async (db: Database) => {
    try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    console.log(`email: ${email}, password: ${password}`)

    if (!email || !password) {
        throw new Error('Admin email or password is missing in .env');
      }
  
      // Sprawdź, czy użytkownik już istnieje
      const existingAdmin = await new Promise<boolean>((resolve, reject) => {
          db.get(
          'SELECT * FROM Users WHERE email_address = ?',
          [email],
          (err, row) => {
            if (err) {
              console.error('Error checking email existence:', err);
              reject(err);
            } else {
              resolve(!!row); 
            }
          }
        );
      });
      console.log(`existingAdmin: ${JSON.stringify(existingAdmin)}`);
  
      if (existingAdmin) {
        console.log('[SEED] Admin user already exists.');
        return;
      }
  
      // Haszuj hasło
      const hashedPassword = await bcrypt.hash(password, 12);

      const now = new Date();
        const formattedDate = formatDateToSQLite(now);
  
      // Dodaj użytkownika do bazy
      db.run(
        `INSERT INTO Users (email_address, password, is_admin) 
         VALUES (?, ?, ?)`,
        [
          email,
          hashedPassword,
          1 // Administrator
        ]
      );
  
      console.log('[SEED] Default admin user added.');
    } catch (error) {
      console.error('Error adding admin user:', error);
    }
  };
  