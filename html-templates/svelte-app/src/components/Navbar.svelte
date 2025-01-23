<script lang="ts">
	import { page } from '$app/stores';
	import { signOut } from '@auth/sveltekit/client';
	import Icon from "@iconify/svelte";
	import { onMount } from 'svelte';
	$: user = $page.data.session?.user;
	let isNavbarOpen: boolean = false; // Dla użytkownika
	let isPagesOpen: boolean = false;  // Dla podstron
	let pages: { pk_id: number; name: string; href: string }[] = [];
    $: {
        console.log(isNavbarOpen);
        console.log(isPagesOpen);
    }

	async function fetchPages() {
		try {
			const response = await fetch('/api/pages');
			if (!response.ok) {
				throw new Error('Failed to fetch pages');
			}
			pages = await response.json();
			console.log(pages);
		} catch (error) {
			console.error('Błąd podczas pobierania stron:', error);
		}
	}

	function toggleNavbar(): void {
		isNavbarOpen = !isNavbarOpen;
	}

	function togglePages(): void {
		isPagesOpen = !isPagesOpen;
	}

	onMount(() => {
	fetchPages();

	// Obsługa kliknięcia poza elementami
	const handleClickOutside = (event: MouseEvent) => {
		const target = event.target as HTMLElement;

		// Sprawdź, czy kliknięcie nastąpiło poza listą użytkownika lub podstron
		const clickedOutsideNavbar = !target.closest('.menu-trigger') && !target.closest('.dropdown-container');
		const clickedOutsidePages = !target.closest('.pages-trigger') && !target.closest('.pages-dropdown-container');

		// Zamknij dropdowny tylko jeśli kliknięcie było poza nimi
		if (clickedOutsideNavbar) {
			isNavbarOpen = false;
		}
		if (clickedOutsidePages) {
			isPagesOpen = false;
		}
	};

	// Dodaj nasłuch na kliknięcie
	document.addEventListener('click', handleClickOutside);

	// Usuń nasłuch po demontażu komponentu
	return () => {
		document.removeEventListener('click', handleClickOutside);
	};
});
</script>

<nav class="sticky top-0 z-10 overflow-hidden flex flex-row flex-wrap content-center justify-between w-full h-20 bg-neutral-900 p-4 font-normal text-lg">
	<a href="/">
		<div class="flex">
			<div class="logo">
				<Icon icon="material-symbols:logo-dev-rounded" width="60px" inline={true} class="inline-block mx-2" />
			</div>
		</div>
	</a>
	<div class="flex flex-wrap justify-end ml-auto mr-10 links">
		<a href="/">Strona główna</a>

		<!-- Rozwijana lista podstron -->
		<div class="relative flex items-center pages-trigger">
			<div
				class="flex items-center hover:cursor-pointer hover:transition-all hover:duration-150 hover:bg-blue-500 hover:bg-opacity-10 rounded-lg p-1 text-white"
				on:click={togglePages}
			>
				Podstrony
				<Icon icon="ep:arrow-down" width="20px" inline={true} class="inline-block mx-2" />
			</div>

			{#if isPagesOpen}
				<div class="fixed top-20 right-25 w-52 bg-neutral-800 shadow-lg rounded-bl-lg rounded-br-lg pages-dropdown-container transition-all duration-100">
					<ul class="max-h-60 overflow-y-auto">
						{#each pages as page}
							<li><a href={`/pages/${page.pk_id}`} class="block w-full h-full text-white px-4 py-2 hover:bg-blue-500 hover:bg-opacity-10">{page.name}</a></li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</div>

	<div class="relative flex items-center menu-trigger">
		{#if !user}
			<a class="border-neutral-500 bg-neutral-800 border-2 rounded-xl flex content-center" href="/login">Zaloguj się</a>
			<a class="bg-neutral-100 border-2 rounded-xl flex content-center text-black" href="/register">Zarejestruj się</a>
		{:else}
			<div class="flex items-center hover:cursor-pointer hover:transition-all hover:duration-150 hover:bg-blue-500 hover:bg-opacity-10 rounded-lg p-1 text-white" on:click={toggleNavbar}>
				<Icon icon="stash:user-avatar" width="40px" inline={true} class="inline-block mx-2" />
				<Icon icon="ep:arrow-down" width="20px" inline={true} class="inline-block" />
			</div>

			{#if isNavbarOpen}
				<div class="fixed top-20 w-52 right-0 bg-neutral-800 shadow-lg rounded-bl-lg rounded-br-lg dropdown-container transition-all duration-100">
					<ul>
						{#if user.isAdmin}
							<li><a href="/admin" class="block w-full h-full">Panel administracyjny</a></li>
						{/if}
						<li on:click={() => signOut({ callbackUrl: '/' })} class="block w-full h-full">Wyloguj się</li>
					</ul>
				</div>
			{/if}
        {/if}
	</div>
</nav>

<style lang="postcss">
	ul li {
		@apply flex items-center w-full h-full no-underline text-white py-2 px-3;
	}

	ul li:last-child {
		@apply rounded-bl-lg rounded-br-lg;
	}

	ul li:hover {
		@apply bg-blue-500 bg-opacity-10 transition-all duration-150 cursor-pointer;
	}

	nav div > a,
	nav div button {
		@apply p-2 mx-3 flex flex-wrap content-center text-white;
	}

	.logo {
		@apply text-white;
	}

	div > a:hover,
	.logo:hover,
	div button:hover {
		@apply scale-110 transition-all duration-150;
	}

	.logo:hover {
		@apply text-blue-500;
	}

	.links a:hover {
		@apply bg-blue-500 bg-opacity-10 rounded-lg;
	}

	.pages-dropdown-container {
		@apply z-20;
	}
</style>
