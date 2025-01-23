<script lang="ts">
    import { page } from "$app/stores";
	import Quill from "quill";
	import { onMount } from "svelte";

    export const prerender = false;

    let pageData = null;
    $: pageData = $page.data.pageData || null; // Usunięto `[0]`

    let editor: string | HTMLElement;
    let quill: Quill;
      
    export let toolbarOptions = [
        [{ header: 1 }, { header: 2 }, { header: 3 }, "blockquote", "link", "image"],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"]
    ];
      
    onMount(async () => {
        const { default: Quill } = await import("quill");
      
        quill = new Quill(editor, {
            modules: {
                toolbar: {
                    container: toolbarOptions,
                },
            },
            theme: "bubble",
            placeholder: "",
            readOnly: true,
        });

        if (pageData && pageData.content) {
            const delta = JSON.parse(pageData.content);
            quill.setContents(delta);
        }
    });
</script>

<div class="pt-6 break-words w-full">
    {#if pageData}
      <h2 class="text-6xl text-start">
        <a class="text-blue-500" href="/">Podstrony</a> &gt; {pageData.name}
      </h2>
      <div class="flex flex-wrap flex-col justify-center relative break-words w-full ql-editor">
        {#if pageData.content}
          <div class="w-full min-h-96" bind:this={editor} />
        {:else}
          <p>Ta strona nie posiada żadnego tekstu!</p>
        {/if}
      </div>
    {:else}
      <p>Ładowanie strony...</p>
    {/if}
</div>

<style>
    @import 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.bubble.css';
</style>