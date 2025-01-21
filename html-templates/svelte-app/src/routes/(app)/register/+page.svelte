<script lang="ts">
    import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

    export let form;
    let showPopup: boolean = false;

    $: isLogged = $page.data.session?.user;

    onMount(() => {
        if (isLogged) {
            goto('/'); 
        }
    });
    
    $: if (form?.errors || form?.success) {
        showPopup = true;
    };

    
    
    // let sex_list = [
    //     { id: 0, name: "Kobieta" },
    //     { id: 1, name: "Mężczyzna" },
    //     { id: 2, name: "Inna" }
    // ];
    // let selectedSex: string = "";
    // let selectedSexId: number | null = null;

    $: console.log(form);
    let formError = '';

    // $: if (users && users.length > 0) {
    //     console.log('Users data loaded:', users);
    // }

    // function updateSelectedSexId() {
    //     const sex = sex_list.find(sex => sex.name === selectedSex);
    //     selectedSexId = sex ? sex.id : null;
    // }

    function closePopup() {
        showPopup = false;
    }
</script>

{#if showPopup}
    <div class="fixed block bg-slate-50 shadow-2xl top-1/4 left-1/4 w-1/2 justify-self-center p-4 z-20 text-black rounded-lg">
        <button class="block" on:click={closePopup}>Zamknij</button>
        <div class="block">Informacje o rejestracji:</div>
        {#if form?.errors}
            {#each Object.entries(form?.errors) as [field, message]}
                    <li class="text-red-500">{message}</li>
            {/each}
        {/if}
        {#if form?.success}
            <span class="text-emerald-500">Rejestracja została przeprowadzona pomyślnie!</span>
        {/if}
    </div>
{/if}
<div class="pt-6">
    <h1 class=" text-7xl text-center text-blue-500">Dołącz do nas</h1>

    <div class="flex flex-wrap justify-center relative">
        <form
            class="bg-slate-50 text-black w-fit min-w-96 px-10 py-6 m-4 rounded-lg flex flex-wrap flex-col items-stretch content-center"
            method="POST"
            use:enhance 
        >
        
            <label for="username">
                Nazwa użytkownika
            </label>
            <input name="username" type="username" value={form?.username || ""} required>
            <label for="password">
                Hasło
            </label>
            <!-- <div class="input-container"> -->
                <input name="password" type="password" value={form?.password || ""} required> <!-- <Icon class="inline-block text-3xl" icon="iconamoon:eye-thin" /> -->
            <!-- </div> -->
            <label for="password2">
                Powtórz hasło
            </label>
            <input name="password2" type="password" value={form?.passwordConfirmation || ""} required>
            <!-- <label for="name">
                Imię
            </label>
            <input name="name" type="text" value={form?.name || ""} required>
            <label for="surname">
                Nazwisko
            </label>
            <input name="surname" type="text" value={form?.surname || ""} required>
            <label for="dateOfBirth">
                Data urodzenia
            </label>
            <input name="dateOfBirth" type="date" value={form?.birthdate || ""} required>
            <label for="sex_list">Płeć</label>
            <select class=" text-black" name="sex" bind:value={selectedSex} on:change={updateSelectedSexId} placeholder="Wybierz płeć..." required>
                {#each sex_list as sex}
                    <option value={sex.id}>{sex.name}</option>
                {/each}
            </select> 
            <input type="hidden" name="sex" value={selectedSexId} /> -->
            <button class="bg-blue-500 text-white rounded-md py-4 mt-6 hover:scale-105 hover:transition-all">Zarejestruj się</button>
            <span class="text-right text-sm">Masz już konto? <a class="underline text-blue-500" href="/login">Zaloguj się.</a></span>
            
        </form>
    </div>
</div>

<style lang="postcss">
    form input, form select {
        @apply  bg-slate-50 border rounded-md mb-4 mt-2 py-2 px-4;
    }

    form > input, form label, form button, .input-container {
        @apply w-full;
    }

    form input:focus, form select:focus {
        outline: none;
    }
</style>