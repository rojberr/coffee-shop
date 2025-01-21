import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { signIn } from '@auth/sveltekit/client';
export const prerender = false;

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string | null;
        const password = formData.get('password') as string | null;

        if (!email || !password) {
            return {
                status: 400,
                error: 'Email and password are required.'
            };
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (result?.error) {
                return {
                    status: 401,
                    error: result.error
                };
            }

            // Redirect to the home page on successful login
            throw redirect(302, '/');
        } catch (error) {
            console.error('Error during login:', error);
            return {
                status: 500,
                error: 'An unexpected error occurred.'
            };
        }
    }
};