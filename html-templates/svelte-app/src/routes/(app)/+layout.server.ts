export const load = async ({ locals, fetch }) => {
    const session = await locals.getSession();
    const loggedIn = !!session?.user;
    console.log({ session });

    //const response = await fetch('/api/pages');
    //const pages = await response.json();
    //console.log(`pages: ${pages}`);
    return {
        session,
        loggedIn
        //pages
    };
  };