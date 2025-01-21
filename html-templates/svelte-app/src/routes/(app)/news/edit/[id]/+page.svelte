<script lang="ts" type="module">
  export const ssr = false;  
  import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
  import { page } from "$app/stores";
	import { redirect } from "@sveltejs/kit";
	import { onDestroy, onMount } from "svelte";
  export const prerender = false;

  interface News {
    pk_id: number;
    content: string; 
    raw_content: string;
    name: string; 
    created_at: string; 
    last_edited: string;
	}

  let news: News;
  $: news = $page.data.news?.[0] || null;
  let name: string = '';
  export let imagesUrl: string[];
  $: imagesUrl = [];
  export let initialImagesUrl: string[];
  $: initialImagesUrl = [];
  let isNewsEdited = false;
  export let initialDelta: any;
  let base64ImageFileNames: { [key: string]: string } = {};

  let editor: string | HTMLElement;
  let quill: any;
  let isQuillLoaded = false;
      
  export let toolbarOptions = [
      [{ header: 1 }, { header: 2 }, { header: 3 }, "blockquote", "link", "image"],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"]
  ];
    
  onMount(async () => {
    if (!browser) return;
    try {
      isQuillLoaded = true;

      const { default: Quill } = await import("quill");
      quill = new Quill(editor, {
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: editImages,
            },
          },
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        },
        },
        theme: "snow",
        placeholder: "Wprowadź tekst..."
      });

      if(news) {
        initialDelta = JSON.parse(news.content);
      
        initialDelta.ops.forEach(async (imgObject: any) => {
          if(imgObject.insert.image) {
            initialImagesUrl.push(imgObject.insert.image);
            imagesUrl.push(imgObject.insert.image);
          }
        })

        quill.setContents(initialDelta);
        name = news.name;

        console.log(`images::: ${imagesUrl}`);
      }
    } catch (error) {
      console.error('Failed to load Quill:', error);
    }
  });

  async function checkForMissingImages(raw_content: string) {
      imagesUrl.forEach(async imageUrl => {
        console.log(`URL: ${imageUrl}`);
        if(raw_content.includes(imageUrl)) {
          console.log('contains');
        }
        if(!raw_content.includes(imageUrl)) {
            try {
            const response = await fetch('/api/upload/image', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                url: imageUrl,
                }),
            });
      
            if (response.ok) {
              const result = await response.json();
              console.log(result);
            } else {
              console.error('Failed to remove image');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      })
    }

  async function editNews() {
    const delta = quill.getContents();
    let deltaString = JSON.stringify(delta);
    const raw_content = quill.getText();
    checkForMissingImages(deltaString);

    const base64Images = extractBase64Images(delta);

    for (const base64Image of base64Images) {
      try {
        const uploadedUrl = await uploadBase64Image(base64Image);
        deltaString = deltaString.replace(base64Image, uploadedUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    try {
      const response = await fetch(`/api/news/${news.pk_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          content: deltaString,
          raw_content: raw_content,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        isNewsEdited = true;
        goto("/");
      } else {
        console.error("Failed to edit news");
      }
    } catch (error) {
      console.error("Error:", error);
    }
}

function extractBase64Images(delta: any): string[] {
  const base64Images: string[] = [];
  delta.ops.forEach((op: any) => {
    if (op.insert && op.insert.image && op.insert.image.startsWith("data:image/")) {
      base64Images.push(op.insert.image);
    }
  });
  return base64Images;
}

async function uploadBase64Image(base64Image: string): Promise<string> {
  const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid base64 image format");
  }

  const mimeType = match[1];
  const base64Data = match[2];
  const binaryData = atob(base64Data);
  const arrayBuffer = new Uint8Array(binaryData.length);

  for (let i = 0; i < binaryData.length; i++) {
    arrayBuffer[i] = binaryData.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });

  const fileName = base64ImageFileNames[base64Image] || `image.${mimeType.split("/")[1]}`; // Default if no name is found

  const formData = new FormData();
  formData.append("image", blob, fileName);

  const response = await fetch("/api/upload/image", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const { data } = await response.json();
  return data;
}

  function editImages() {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.onchange = () => {
    const file = input.files?.[0];
    if (file && /^image\//.test(file.type)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target?.result as string;
        base64ImageFileNames[base64Image] = file.name; // Map base64 image to file name
        insertToEditor(base64Image);
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("You can only upload images.");
    }
  };
}

  function insertToEditor(url: string) {
  const range = quill.getSelection();
  if (range) {
    quill.insertEmbed(range.index, "image", `${url}`);
  }
}
</script>

{#if isQuillLoaded}
<div class="pt-6 break-words w-full">
    {#if news}
      <h2 class="text-6xl text-start">
        <a class="text-bno-500" href="/">Aktualności</a> &gt; Edycja &gt; {news.name}
      </h2>
      <div class="flex flex-wrap flex-col justify-center relative break-words w-full ql-editor">
          <input class="inline-block w-1/4" type="text" bind:value={name} placeholder="Nazwa aktualności...">
          <div class="text-xl">{news.created_at} Edited: {news.last_edited}</div>
          <div class="w-full min-h-96" bind:this={editor} />
          <button class="inline-block w-1/12 hover:cursor-pointer" on:click={editNews}>Edytuj</button>
      </div>
    {:else}
      <p>Ładowanie aktualności...</p>
    {/if}
  </div>
  {:else}
  <p>Ładowania edytora...</p>
{/if}

<style lang="postcss">
    @import 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';

    input, button {
        @apply  border rounded-md mb-4 mt-2 py-2 px-4 bg-neutral-900;
    }

    input:focus {
        outline: none;
    }
</style>