import type { PageServerLoad } from "./$types";
export const prerender = false;

export const load: PageServerLoad = async ({ fetch, locals }) => {
    const session = await locals.getSession();
    const isAdmin = !!session?.user?.isAdmin;

    return {
        isAdmin
    };
};