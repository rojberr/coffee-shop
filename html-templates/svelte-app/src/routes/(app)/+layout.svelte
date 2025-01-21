<script lang="ts">
	import '../../app.css';
	import Navbar from "../../components/Navbar.svelte";
    import Footer from '../../components/Footer.svelte'
	import type { PageData } from './$types';
    //import type { PageData } from './$types';
    //export let data: PageData;
	// let { children } = $props();
    export let data: PageData;
</script>

<!-- {@render children()} -->
<main class="w-full h-auto min-h-full bg-neutral-900 shadow-xl">
    <Navbar pages={data.pages}/>
    <section class="row-start-2 row-span-8 min-h-96 bg-neutral-800">
        <slot />
    </section>
    <Footer />
</main>