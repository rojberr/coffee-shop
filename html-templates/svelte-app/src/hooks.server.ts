import type { Handle } from '@sveltejs/kit';
import db from '$lib/db/index';
import { handle as authHandle } from './auth'; // Import the SvelteKitAuth handle

export const handle: Handle = async ({ event, resolve }) => {
  try {
    // Step 1: Assign the database instance to event.locals
    event.locals.db = db;

    // Step 2: Run the auth handle function
    const response = await authHandle({ event, resolve });

    return response;
  } catch (error) {
    console.error('Error in hooks.server.ts:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};