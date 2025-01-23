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

    let users = [];
    $: users = $page.data.users || [];
</script>

<div class="table-container">
    <div class="table-title">Użytkownicy</div>
    <table class='styled-table'>
        <thead>
            <tr>
                <td>Lp.</td>
                <td>Imię</td>
                <td>Nazwisko</td>
                <td>Email</td>
            </tr>
        </thead>
        <tbody>
            {#each users ?? [] as user, index}
                <tr>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.surname}</td>
                    <td>{user.email_address}</td>
                </tr>
            {/each}
        </tbody>
    </table>
    
    
</div>

<style lang="postcss">
    .table-container {
    //max-width: 80%;
    margin: 20px auto;
    padding: 10px;
    background-color: #1e1e1e; /* Ciemne tło */
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

/* Tytuł tabeli */
.table-title {
    color: #ff7f50; /* Pomarańczowy kolor, pasujący do akcentów */
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 10px;
    font-weight: bold;
}

/* Stylizacja tabeli */
.styled-table {
    width: 100%;
    border-collapse: collapse;
    color: #e0e0e0; /* Tekst w jasnoszarym kolorze */
    font-size: 1rem;
}

/* Nagłówki tabeli */
.styled-table thead th {
    background-color: #2c2c2c; /* Ciemny kolor nagłówków */
    color: #ff7f50; /* Akcentowy kolor */
    text-align: left;
    padding: 12px;
    font-weight: bold;
    border-bottom: 2px solid #3a3a3a; /* Subtelna linia */
}

/* Wiersze tabeli */
.styled-table tbody tr {
    background-color: #242424; /* Ciemnoszary kolor */
     /* Subtelne linie oddzielające */
}

.styled-table tbody tr:not(:last-child) {
    border-bottom: 1px solid #3a3a3a;
}

/* Wiersze naprzemienne */
.styled-table tbody tr:nth-child(even) {
    background-color: #2a2a2a; /* Trochę jaśniejszy kolor */
}

/* Hover efekt */
.styled-table tbody tr:hover {
    background-color: #383838; /* Efekt hover dla lepszej interakcji */
    cursor: pointer;
}

/* Komórki tabeli */
.styled-table td, .styled-table th {
    padding: 10px 15px;
    text-align: left;
}

/* Dodanie zaokrąglonych narożników do pierwszego i ostatniego wiersza */
.styled-table tbody tr:first-child td:first-child {
    border-top-left-radius: 8px;
}
.styled-table tbody tr:first-child td:last-child {
    border-top-right-radius: 8px;
}
.styled-table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 8px;
}
.styled-table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 8px;
}
</style>

