<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { raw } from "@auth/core";
	import { redirect } from "@sveltejs/kit";
	import type Quill from "quill";
    import { onMount, onDestroy } from "svelte";
  
    let editor: string | HTMLElement;
    let quill: Quill;
    let name = '';
    let isNewsAdded = false;
    let imagesUrl: string[];
    $: imagesUrl = [];

    $: isAdmin = $page.data.isAdmin;
    
    onMount(() => {
        if (!isAdmin) {
            goto('/'); 
        }
    });
      
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
            handlers: {
              image: addImages,
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

      const handleBeforeUnload = (event: any) => {
      checkForMissingImages('');
    };

    // Add the event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    onDestroy(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    });
    });

    onDestroy(async () => {
      if(!isNewsAdded) {
        checkForMissingImages('');
      }
    });

    async function addNews() {
      //const delta = quill.root.innerHTML;
      const delta = quill.getContents();
      const deltaString = JSON.stringify(delta);
      const raw_content = quill.getText();
      checkForMissingImages(deltaString);
      console.log(`raw data: ${raw_content}`);
      console.log(delta);
      console.log(name);
      console.log(deltaString);

      try {
          const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: name,
              content: deltaString,
              raw_content: raw_content
              }),
          });
    
          if (response.ok) {
            const result = await response.json();
            isNewsAdded = true;
            console.log(result);
            
          } else {
            console.error('Failed to check email existence');
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          goto('/');
        }
    }

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

  //   function selectLocalImage() { 
  //   console.log('selecting image');
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.click();

  //   input.onchange = () => {
  //     const file = input.files?.[0];
  //     if (file && /^image\//.test(file.type)) {
  //       saveToServer(file);
  //     } else {
  //       console.warn('You can only upload images.');
  //     }
  //   };
  // }

    // zabezpieczyc wychodzenie ze strony, zeby wtedy nie zapisywalo zdjec bez dodania newsa
    // moze byc flaga, ktora ustawia sie na true przy dodawaniu newsa
    // jezeli nastapi wyjscie ze strony (onDestroy) bez ustawionej flagi, to zdjecia sa usuwane z serwera
    function saveToServer(file: File) {
      console.log('saving to server');
      const fd = new FormData();
      fd.append('image', file);
      fd.append('folder', 'news');

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload/image', true);
      xhr.onload = () => {
        if (xhr.status === 200) {
          // this is callback data: url
          console.log('status 200');
          const url = JSON.parse(xhr.responseText).data;
          insertToEditor(url);
          imagesUrl.push(url);
        }
      };
      xhr.send(fd);
    }

    function addImages() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.click();

      input.onchange = () => {
        const file = input.files?.[0];
        if (file && /^image\//.test(file.type)) {
          saveToServer(file);
          
          console.log(imagesUrl);
      } else {
        console.warn('You can only upload images.');
      }
      }
    }

    function insertToEditor(url: string) {
      // push image url to rich editor.
      const range = quill.getSelection();
      if(range){
        console.log(`inserting ${url}`);
        quill.insertEmbed(range.index, 'image', `${url}`);
      }
    }
  </script>
  
  <style lang="postcss">
    @import 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';

    input, button {
        @apply  border rounded-md mb-4 mt-2 py-2 px-4 bg-neutral-900;
    }

    input:focus {
        outline: none;
    }
  </style>
  
  <div class="editor-wrapper flex flex-col items-center">
    <input class="inline-block w-1/4" type="text" bind:value={name} placeholder="Nazwa oferty...">
    
    <div class="bg-slate-100 text-black w-11/12 ">
      <div class="w-full min-h-96" bind:this={editor} />
    </div>
    <button class="inline-block w-1/12" on:click={addNews}>Dodaj</button>
    
  </div>

    