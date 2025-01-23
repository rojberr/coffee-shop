<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import { page } from "$app/stores";
    $: isAdmin = $page.data.isAdmin;
    
    onMount(() => {
        if (!isAdmin) {
            goto('/'); 
        }
    });

    let pageData = [];
    $: pageData = $page.data.pageData || [];
    $: {
        console.log(pageData);
    }
    
  
    export let pk_id: number | null = null;
  
    let name = "";
    let content = "";
    let editor: string | HTMLElement;
    let quill: any;

    export let imagesUrl: string[];
    $: imagesUrl = [];
    export let initialImagesUrl: string[];
    $: initialImagesUrl = [];
    let isNewsEdited = false;
    export let initialDelta: any;
    let base64ImageFileNames: { [key: string]: string } = {};

    export const toolbarOptions = [
      [{ header: 1 }, { header: 2 }, { header: 3 }, "blockquote", "link", "image"],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"]
    ];
  
    onMount(async () => {
        if (!isAdmin) {
            goto('/'); 
        }
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
        placeholder: "Wprowadź zawartość podstrony...",
      });

      pk_id = pageData.pk_id;
      name = pageData.name;
      content = pageData.content;

      if (pageData.pk_id) {
          name = pageData.name;
          initialDelta = JSON.parse(pageData.content);
          quill.setContents(initialDelta);
          
          initialDelta.ops.forEach(async (imgObject: any) => {
          if(imgObject.insert.image) {
            initialImagesUrl.push(imgObject.insert.image);
            imagesUrl.push(imgObject.insert.image);
          }
        })

      }
    });
  
    async function savePage() {
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

  const method = pk_id ? "PUT" : "POST";
  const url = "/api/pages";

  const body = JSON.stringify({
    ...(pk_id && { id: pk_id }), // Dodaj id tylko dla PUT
    name: name,
    content: deltaString,
    raw_content: raw_content,
  });

  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body,
  });

  console.log("Odpowiedź serwera:", response);

  if (response.ok) {
    const responseData = await response.json(); // Odczytaj body odpowiedzi
    isNewsEdited = true;
    console.log("Dane zwrócone przez serwer:", responseData);

    // Przekierowanie po sukcesie
    goto("/admin/pages");
  } else {
    const errorData = await response.json();
    console.error("Błąd podczas zapisywania podstrony:", errorData);
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
  formData.append("folder", 'pages');

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
  </script>
  
  <div>
    <h1>{pk_id ? "Edycja podstrony" : "Nowa podstrona"}</h1>
    <input class="text-black" bind:value={name} placeholder="Nazwa podstrony" />
  
    <div bind:this={editor}></div>
  
    <button on:click={savePage}>Zapisz</button>
  </div>
  
  <style>
    @import 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';
  </style>