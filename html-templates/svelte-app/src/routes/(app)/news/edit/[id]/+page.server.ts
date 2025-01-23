import type { PageServerLoad } from "./$types";
export const prerender = false;

export const load: PageServerLoad = async ({ fetch, params, url, locals }) => {
    const session = await locals.getSession();
    const isAdmin = !!session?.user?.isAdmin;

    console.log(`params: ${JSON.stringify(params)}`);
    console.log(`url.pathname: ${url.pathname}`);
    const { id } = params;
    console.log(`id: ${id}`)

    if (!id || isNaN(Number(id))) {
        console.error(`Invalid id: ${id}`);
        return { news: null, isAdmin };
    }

    try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
            console.error('Failed to fetch news`:', response.statusText);
            return { news: null, isAdmin };
        }
        const news = await response.json();
        //console.log(`news: ${JSON.stringify(news[0])}`);
        return { news, isAdmin };
    } catch (error) {
        console.error("Error fetching news:", error);
        return { news: null, isAdmin };
    }
};