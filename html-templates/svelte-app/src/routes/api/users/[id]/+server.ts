import type { User } from '$lib/types';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, params }) => {
const { id } = params;
  try {
    const loadDataPromise = new Promise<User[]>((resolve, reject) => {
        const db = locals.db;
        if (!db) {
            console.error('Database connection not found');
            throw new Error('Database connection not found');
        }
        const query = "SELECT pk_id, name, surname, email_address, birthdate, sex, created_at, last_active, is_admin FROM users WHERE pk_id = ?";
        db.all<User>(query, [ id ], (err: Error|null, rows: User[]) => {
            if(err) {
                console.error('Error fetching user:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
    const users = await loadDataPromise;
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};