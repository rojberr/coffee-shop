<nav class="sticky top-0 z-10 overflow-hidden flex flex-row flex-wrap content-center shadow-lg justify-between w-full h-20 bg-neutral-900 p-4 font-normal text-lg border-neutral-600 border-b">
    <a href="/">
        <div class="flex">
            <div class="logo">
                <Icon icon="material-symbols:logo-dev-rounded" width="60px" inline={true} class="inline-block mx-2" />
            </div>
        </div>
    </a>
    <div class="flex flex-wrap justify-end ml-auto mr-10 links">
        <a href="/">Wróć do strony głównej</a>
    </div>
    <div class="relative flex items-center menu-trigger">
            <div class="flex items-center hover:cursor-pointer hover:transition-all hover:duration-150 hover:bg-blue-500 hover:bg-opacity-10 rounded-lg p-1" on:click={toggleNavbar}>
                <Icon icon="stash:user-avatar" width="40px" inline={true} class="inline-block mx-2" />
                <Icon icon="ep:arrow-down" width="20px" inline={true} class="inline-block" />
            </div>

            {#if isNavbarOpen}
                <div class="fixed top-20 w-40 right-0 bg-neutral-800 shadow-lg rounded-bl-lg rounded-br-lg dropdown-container transition-all duration-100">
                    <ul>
                        <li on:click={() => signOut({ callbackUrl: '/' })}>Wyloguj się</li>
                    </ul>
                </div>
            {/if}
            
            <!-- <button class="bg-neutral-100 border-2 rounded-xl flex content-center text-black" on:click={() => signOut({ callbackUrl: '/' })}>Wyloguj się</button> -->
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
</style>

<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
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