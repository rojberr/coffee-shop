<script lang="ts">
    import { goto } from "$app/navigation";
	import { page } from "$app/stores";
    import { onMount } from "svelte";

    let pages: { pk_id: number; name: string }[] = [];
    $: pages = $page.data.pages || [];

    $: isAdmin = $page.data.isAdmin;
    
    onMount(() => {
        if (!isAdmin) {
            goto('/'); 
        }
    });
  
    async function deletePage(pk_id: number) {
  if (!confirm("Czy na pewno chcesz usunąć tę podstronę?")) return;

  try {
    const response = await fetch(`/api/pages?id=${pk_id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload(); // Przeładuj stronę, aby odświeżyć listę
    } else {
      console.error("Failed to delete page");
    }
  } catch (error) {
    console.error("Error deleting page:", error);
  }
}
  </script>
  
  <div class="container text-white">
    <h1 class="text-4xl font-bold mb-4">Zarządzanie podstronami</h1>
  
    <button class="btn-green mb-4" on:click={() => goto("/admin/pages/edit/new")}>
      Dodaj nową podstronę
    </button>
  
    {#if pages.length > 0}
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="border p-2">ID</th>
            <th class="border p-2">Nazwa</th>
            <th class="border p-2">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {#each pages as page}
            <tr>
              <td class="border p-2">{page.pk_id}</td>
              <td class="border p-2">{page.name}</td>
              <td class="border p-2">
                <button
                  class="btn-blue mr-2"
                  on:click={() => goto(`/admin/pages/edit/${page.pk_id}`)}
                >
                  Edytuj
                </button>
                <button class="btn-red" on:click={() => deletePage(page.pk_id)}>
                  Usuń
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>Brak podstron do wyświetlenia.</p>
    {/if}
  </div>
  
  <style>
    .btn-green {
      background-color: #34d399;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .btn-blue {
      background-color: #3b82f6;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .btn-red {
      background-color: #ef4444;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
  
    .btn-green:hover,
    .btn-blue:hover,
    .btn-red:hover {
      opacity: 0.9;
    }
  </style>
  