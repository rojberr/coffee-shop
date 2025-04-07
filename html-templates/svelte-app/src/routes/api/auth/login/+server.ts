import type { User } from '$lib/types';
import { verifyPassword } from '$lib/utils';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    console.log('LOGIN ENDPOINT');
    const { email_address, password } = await request.json();
    console.log(password)

    if (!email_address || !password) {
      return new Response(JSON.stringify({ success: false, message: 'Email and password are required' }), {
        status: 400,
      });
    }

    const db = locals.db;
    if (!db) {
      console.error('Database connection not found');
      return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
        status: 500,
      });
    }

    const query = `
      SELECT *
      FROM Users
      WHERE email_address = ?
    `;

    // Create a promise to handle the asynchronous nature of db.all
    const loadDataPromise: Promise<User[]> = new Promise((resolve, reject) => {
      db.all<User>(query, [email_address], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    // Wait for the promise to resolve or reject
    const rows = await loadDataPromise;
    console.log(rows);
    const isValid = await verifyPassword(password, rows[0].password);
    console.log(isValid);
    if (rows.length > 0 && isValid)  {
      // Authentication successful
      console.log('authneticated');
      return new Response(
        JSON.stringify({ success: true, message: 'User authenticated.', id: rows[0].pk_id, email: rows[0].email_address, isAdmin: rows[0].is_admin }),
        { status: 200 }
      );
    } else {
      // No matching user found
      return new Response(JSON.stringify({ success: false, message: 'Invalid email or password' }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), {
      status: 500,
    });
  }
};