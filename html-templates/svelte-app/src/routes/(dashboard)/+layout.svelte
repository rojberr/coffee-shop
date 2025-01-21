<script lang="ts">
	import '../../app.css';
	import DashboardHeader from '../../components/DashboardHeader.svelte';
	import DashboardNavbar from '../../components/DashboardNavbar.svelte';
    //import type { PageData } from './$types';
    //export let data: PageData;
	// let { children } = $props();
</script>

<!-- {@render children()} -->
<main class="w-full h-screen flex flex-col bg-neutral-900 shadow-xl">
    <DashboardHeader/>
    <section class="h-full flex flex-1">
        <DashboardNavbar/>
        <div class="p-6 flex-1 overflow-auto bg-neutral-800"><slot/></div>
    </section>
</main>