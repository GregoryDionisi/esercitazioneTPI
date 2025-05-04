<script>
    // Stato per memorizzare i post e il nuovo titolo
    let posts = [];
    let newPostTitle = "";
  
    // Funzione per caricare i post dal backend
    async function fetchPosts() {
      try {
        const response = await fetch("http://localhost:3000/api/posts");
        if (!response.ok) throw new Error("Errore nel caricamento");
        posts = await response.json(); // Aggiorna lo stato
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  
    // Funzione per inviare un nuovo post
    async function addPost() {
      try {
        const response = await fetch("http://localhost:3000/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newPostTitle }),
        });
        if (!response.ok) throw new Error("Errore nell'invio");
        newPostTitle = ""; // Resetta il form
        await fetchPosts(); // Ricarica i post
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  
    // Carica i post all'avvio
    onMount(fetchPosts);
  </script>
  
  <div>
    <!-- Form per aggiungere un post -->
    <input type="text" bind:value={newPostTitle} placeholder="Titolo del post" />
    <button on:click={addPost}>Aggiungi</button>
  
    <!-- Lista dei post -->
    <ul>
      {#each posts as post (post.id)}
        <li>{post.title}</li>
      {/each}
    </ul>
  </div>