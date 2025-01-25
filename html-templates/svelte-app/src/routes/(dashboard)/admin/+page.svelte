<div class="text-white">Witaj w panelu administracyjnym!</div>

<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
    $: isAdmin = $page.data.isAdmin;
    
    onMount(() => {
        if (!isAdmin) {
            goto('/'); 
        }
    });
</script>