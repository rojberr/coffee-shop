import type { User } from '$lib/types';
import { hashPassword } from '$lib/utils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const loadDataPromise = new Promise<User[]>((resolve, reject) => {
        const db = locals.db;
        if (!db) {
            console.error('Database connection not found');
            throw new Error('Database connection not found');
        }
        const query = "SELECT pk_id, name, surname, email_address, birthdate, sex, created_at, last_active, is_admin FROM users";
        db.all<User>(query, (err: Error|null, rows: User[]) => {
            if(err) {
                console.error('Error fetching users:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
    const users = await loadDataPromise;
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    
    const db = locals.db;
    const { name, surname, email_address, password, birthdate, sex, created_at, last_active, is_admin } = await request.json();

    console.log(`[ON ENDPOINT] name: ${name}, name: ${surname}, email: ${email_address}, password: ${password}, birthdate: ${birthdate}, sex: ${sex}, created: ${created_at}, last_active: ${last_active}, is_admin: ${is_admin}`)
    const hashedPassword = await hashPassword(password);
    const result = await db.run(
      'INSERT INTO Users (name, surname, email_address, password, birthdate, sex, created_at, last_active, is_admin) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"), 0)',
      [name, surname, email_address, hashedPassword, birthdate, sex]
    );

    return new Response(JSON.stringify({ user: result }), { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

