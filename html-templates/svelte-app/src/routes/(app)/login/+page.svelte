<script lang="ts">
    import { enhance } from '$app/forms';
    export const prerender = false;
    import { signIn } from '@auth/sveltekit/client';
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

    let email = '';
    let password = '';

    $: isLogged = $page.data.session?.user;

    onMount(() => {
        if (isLogged) {
            goto('/'); 
        }
    });

    async function handleLogin(event: Event) {
    event.preventDefault();
    console.log('im in FE login handle');
    
    const result = await signIn('credentials', {
        redirect: false,
        callbackUrl: '/',
        email,
        password
    });

    if (result?.error) {
        // Handle error (e.g., show a message)
        console.error('Login failed:', result.error);
    } else {
        // Successfully logged in
        console.log('Login successful');
        goto('/'); // Redirect to home page
    }
}

    
</script>

<div class="pt-6">
    <h1 class="text-7xl text-center text-blue-500">Zaloguj się</h1>
    <div class="flex flex-wrap justify-center">
        <form class="bg-slate-50 text-black w-fit min-w-96 px-10 py-6 m-4 rounded-lg flex flex-wrap flex-col items-stretch content-center" 
        method="POST"
        on:submit={handleLogin}
        >
            <label for="email">
                Email
            </label>
            <input name="email" type="email" bind:value={email} required>
            <label for="password">
                Hasło
            </label>
            <input name="password" type="password" bind:value={password} required>
            <button class="bg-blue-500 text-white rounded-md py-4 mt-6 hover:scale-105 hover:transition-all" >Zaloguj się</button>
            <span class="text-right text-sm">Nie masz konta? <a class="underline text-blue-500" href="/register">Zarejestruj się.</a></span>
            
        </form>
    </div>
</div>

<style lang="postcss">
    form input {
        @apply bg-slate-50 border rounded-md mb-4 mt-2 py-2 px-4;
    }

    form > input, form label, form button, .input-container {
        @apply w-full;
    }

    form input:focus {
        outline: none;
    }
</style>
