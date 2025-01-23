<script lang="ts">
	import '../../app.css';
	import DashboardHeader from '../../components/DashboardHeader.svelte';
	import DashboardNavbar from '../../components/DashboardNavbar.svelte';
</script>

<main class="w-full h-screen flex flex-col bg-neutral-900 shadow-xl">
    <!-- Nagłówek z pozycją sticky -->
    <DashboardHeader/>
    
    <!-- Sekcja zawartości z odpowiednim przewijaniem -->
    <section class="h-full flex flex-1 overflow-hidden">
        <!-- Panel nawigacji -->
        <DashboardNavbar/>

        <!-- Główna zawartość -->
        <div class="p-6 flex-1 overflow-auto bg-neutral-800">
            <slot />
        </div>
    </section>
</main>

<style>
    .sticky {
  position: sticky;
  top: 0;
  z-index: 10;
}

main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

section {
  display: flex;
  flex: 1;
  overflow: hidden;
}

section > div {
  flex: 1;
  overflow-y: auto; /* Główna zawartość przewijana */
}



</style>