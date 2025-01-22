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
    <div class="text-blue-500 text-6xl text-center uppercase m-5 flex items-center justify-center">
      Aktualności
      {#if isAdmin}
        <a href="/news/add" class="flex">
          <div class="inline-flex flex-col items-center content-center mx-10 hover:scale-125 hover:text-blue-400 transition-all">
            <Icon icon="ic:baseline-plus" width="30px" inline={true} class="inline-block" />
            <span class="text-xs">DODAJ</span>
          </div>
        </a>
      {/if}
    </div>
    <div class="flex flex-wrap w-full justify-center gap-6">
      {#if news}
        {#each news as entry}
          <div class="news-card bg-slate-300 text-black border p-4 rounded-lg shadow-lg transition-all transform hover:scale-105 w-80">
            <div class="flex flex-col h-full">
              {#if isAdmin}
                <div class="flex justify-between mb-4">
                  <button
                    class="btn-blue"
                    on:click={(event) => {
                      event.stopPropagation();
                      goto(`news/edit/${entry.pk_id}`);
                    }}
                  >
                    Edytuj
                  </button>
                  <button
                    class="btn-blue"
                    tabindex="0"
                    on:click={() => removeNews(entry.pk_id)}
                  >
                    Usuń
                  </button>
                </div>
              {/if}
              <div class="text-xl text-center text-blue-500 font-bold mb-2">{entry.name}</div>
              <div class="text-xs mb-4">{entry.created_at}</div>
              <div class="line-clamp-6 text-start mb-4">{@html entry.raw_content}</div>
              <a
                href={`news/${entry.pk_id}`}
                class="mt-auto text-center text-blue-600 underline hover:text-blue-800"
              >
                Zobacz szczegóły
              </a>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-gray-500">Brak aktualności</p>
      {/if}
    </div>
  </div>

<style lang="postcss">
  .news-card {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f8fafc; /* jaśniejszy odcień tła */
    border: 1px solid #cbd5e0; /* delikatny kolor ramki */
    padding: 16px;
    border-radius: 8px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .news-card:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }

  .btn-blue {
    background-color: #3b82f6; /* niebieski */
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .btn-blue:hover {
    background-color: #2563eb; /* ciemniejszy niebieski */
    transform: scale(1.1);
  }

  .btn-blue:focus {
    outline: none;
    box-shadow: 0px 0px 6px rgba(59, 130, 246, 0.5);
  }

  .line-clamp-6 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }
</style>