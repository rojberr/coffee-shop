<script lang="ts">
    import { page } from "$app/stores";
	import Quill from "quill";
	import { Delta } from "quill/core";
	import { onMount } from "svelte";

    export const prerender = false;

    let news = null;
    $: news = $page.data.news?.[0] || null;

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

      const delta = JSON.parse(news.content);

      quill.setContents(delta);
    });
</script>

<div class="pt-6 break-words w-full text-white">
    {#if news}
      <h2 class="text-6xl text-start">
        <a class="text-blue-500" href="/">Ogłoszenia</a> &gt; {news.name}
      </h2>
      <div class="flex flex-wrap flex-col justify-center relative break-words w-full ql-editor">
        {#if news.content}
          <div class="text-xl">{news.created_at}</div>
          <div class="w-full min-h-96" bind:this={editor} />
        {:else}
          <p>To ogłoszenie nie posiada żadnego tekstu!</p>
        {/if}
      </div>
    {:else}
      <p>Ładowanie ogłoszenia...</p>
    {/if}
  </div>

<style lang="postcss">
    @import 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.bubble.css';
</style>