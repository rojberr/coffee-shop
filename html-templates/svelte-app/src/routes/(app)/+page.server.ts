import type { PageServerLoad } from "./$types";
export const prerender = false;

export const load: PageServerLoad = async ({ fetch }) => {
    const response = await fetch('/api/news');
    const news = await response.json();
    console.log(`news: ${news}`);

    return {
        news
    };
};