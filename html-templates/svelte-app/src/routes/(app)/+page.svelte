<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
    import Icon from '@iconify/svelte';
	import { redirect } from "@sveltejs/kit";

    let news = [];
    $: news = $page.data.news || [];
    $: isAdmin = $page.data.session?.user?.isAdmin;

    export async function removeNews(id: string) {
        try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        goto("/");
      } else {
        console.error("Failed to remove news");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    }
</script>

<div>
    <div class="text-blue-500 text-6xl text-center uppercase m-5 flex items-center justify-center">Aktualności
      {#if isAdmin}
      <a href="/news/add" class="flex">
        <div class="inline-flex flex-col items-center content-center mx-10 hover:scale-125 hover:text-blue-400 transition-all">
          <Icon icon="ic:baseline-plus" width="30px" inline={true} class="inline-block" /><span class="text-xs">DODAJ</span>
        </div>
      </a>
      {/if}
    </div>
    <div class="flex flex-wrap flex-row w-full justify-center">
        {#if news}
            {#each news as entry}
                <a class="inline-block w-5/12 mx-10 my-4 hover:scale-105 transition-all" href={`news/${entry.pk_id}`}>
                    <div class="inline-block w-full min-h-64 bg-slate-300 text-black border p-2 rounded-lg break-words line-clamp-6">
                       {#if isAdmin}
                        <div class="flex flex-wrap justify-between">
                          <button class=" z-30 border rounded-md mb-4 mt-2 py-2 px-4 bg-blue-500 focus:outline-none hover:scale-110 transition-all hover:bg-blue-700" on:click={(event) => { event.stopPropagation(); goto(`news/edit/${entry.pk_id}`) }}>Edytuj</button>
                          <button class="border rounded-md mb-4 mt-2 py-2 px-4 bg-blue-500 focus:outline-none hover:scale-110 transition-all hover:bg-blue-700" tabindex="0" on:click={() => removeNews(entry.pk_id)}>Usuń</button>
                        </div>
                        {/if}
                        <div class="text-xl text-center text-blue-500 font-bold">{entry.name}</div>
                        <div class="text-xs">{entry.created_at}</div>
                        <div class="line-clamp-6 text-start">{@html entry.raw_content}</div>
                    </div>
                </a>
            {/each}
        {:else}
            Brak aktualności
        {/if}
    </div>
    
    
</div>

<style lang="postcss">

</style>