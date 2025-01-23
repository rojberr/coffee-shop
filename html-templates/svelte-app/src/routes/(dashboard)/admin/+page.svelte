Witaj w panelu administracyjnym!

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