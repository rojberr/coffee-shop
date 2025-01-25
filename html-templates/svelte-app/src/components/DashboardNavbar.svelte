<nav class="flex-shrink-0 top-0 z-10 overflow-hidden flex flex-col flex-wrap content-center justify-between w-56 h-full bg-neutral-900 p-4 font-normal text-sm border-neutral-600 border-r shadow-lg">
    <div class="flex flex-wrap flex-col justify-start ml-auto mr-10 links h-full text-white">
        Panel administracyjny
        <a href="/admin"><Icon icon="material-symbols-light:home-outline" width="20px" inline={true} class="inline-block mx-2 text-white" />Panel główny</a>
        <a href="/admin/pages"><Icon icon="iconoir:multiple-pages-empty" width="20px" inline={true} class="inline-block mx-2 text-white" />Strony</a>
        <a href="/admin/users"><Icon icon="mdi:users" width="20px" inline={true} class="inline-block mx-2 text-white" />Użytkownicy</a>
    </div>
</nav>

<style lang="postcss">
    ul li {
        @apply py-4 px-5;
    }

    ul li:last-child {
        @apply rounded-bl-lg rounded-br-lg;
    }

    ul li:hover {
        @apply bg-blue-500 bg-opacity-10 transition-all duration-150 cursor-pointer;
    }

    nav div a, nav div button {
        @apply p-2 mx-3 flex flex-wrap content-center;
    }

    div a:hover, .logo:hover, div button:hover {
        @apply scale-110 transition-all duration-150;
    }

    .logo:hover {
        @apply text-blue-500;
    }

    .links a:hover {
        @apply bg-blue-500 bg-opacity-10 rounded-lg;
    }

    .links a {
        @apply w-full;
    }
</style>

<script lang="ts">
	import { page } from '$app/stores';
	//import { signOut } from '@auth/sveltekit/client';
    import Icon from "@iconify/svelte";
	import { onMount } from 'svelte';
    $: loggedIn = $page.data.session;
    let isNavbarOpen: boolean = false;

    if (!loggedIn) {
        console.log(loggedIn);
    }

    function toggleNavbar(): void {
        isNavbarOpen = !isNavbarOpen;
    }

    onMount(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.menu-trigger') && !target.closest('.dropdown-container')) {
                isNavbarOpen = false;
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>