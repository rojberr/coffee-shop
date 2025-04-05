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
        const query = "SELECT pk_id, email_address, is_admin FROM users";
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
    const { email_address, password, is_admin } = await request.json();

    console.log(`[ON ENDPOINT] email: ${email_address}, password: ${password}xw`)
    const hashedPassword = await hashPassword(password);
    const result = await db.run(
      'INSERT INTO Users (email_address, password, is_admin) VALUES (?, ?, 0)',
      [email_address, hashedPassword]
    );

    return new Response(JSON.stringify({ user: result }), { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

