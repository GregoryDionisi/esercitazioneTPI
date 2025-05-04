<script>
    // Stato dell'applicazione
    let products = $state([]);
    let newProductName = $state('');
    let loading = $state(true);
    let error = $state(null);
    let message = $state(null);
  
    // URL del backend (in un'applicazione reale sarebbe in un file di configurazione)
    const API_URL = 'http://localhost:3000/products';
  
    // Carica i prodotti dal backend all'avvio del componente
    $effect(() => {
      fetchProducts();
    });
  
    // Funzione per recuperare i prodotti dal backend
    async function fetchProducts() {
      loading = true;
      error = null;
      
      try {
        // In un'applicazione reale, questa sarebbe una vera chiamata API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        // Aggiorna lo stato con i dati ricevuti
        products = await response.json();
      } catch (e) {
        error = `Errore nel caricamento dei prodotti: ${e.message}`;
        console.error(error);
      } finally {
        loading = false;
      }
    }
  
    // Funzione per aggiungere un nuovo prodotto
    async function addProduct() {
      if (!newProductName.trim()) return;
      
      loading = true;
      error = null;
      message = null;
      
      try {
        // Preparazione del nuovo prodotto
        const newProduct = {
          name: newProductName.trim(),
          price: Math.floor(Math.random() * 100) + 1, // Prezzo casuale per semplicità
        };
        
        // Chiamata API per salvare il prodotto
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        });
        
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        // Otteniamo il prodotto con l'ID assegnato dal server
        const savedProduct = await response.json();
        
        // Aggiorniamo lo stato locale aggiungendo il nuovo prodotto
        products = [...products, savedProduct];
        
        // Reset del form
        newProductName = '';
        message = 'Prodotto aggiunto con successo!';
      } catch (e) {
        error = `Errore nell'aggiunta del prodotto: ${e.message}`;
        console.error(error);
      } finally {
        loading = false;
      }
    }
  
    // Funzione per eliminare un prodotto
    async function deleteProduct(id) {
      loading = true;
      error = null;
      message = null;
      
      try {
        // Chiamata API per eliminare il prodotto
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        // Aggiorniamo lo stato locale rimuovendo il prodotto
        products = products.filter(product => product.id !== id);
        message = 'Prodotto eliminato con successo!';
      } catch (e) {
        error = `Errore nell'eliminazione del prodotto: ${e.message}`;
        console.error(error);
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="product-manager">
    <h1>Gestione Prodotti</h1>
    
    <!-- Form per aggiungere un nuovo prodotto -->
    <div class="add-product">
      <form on:submit|preventDefault={addProduct}>
        <input
          type="text"
          placeholder="Nome del prodotto"
          bind:value={newProductName}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !newProductName.trim()}>
          {loading ? 'Caricamento...' : 'Aggiungi Prodotto'}
        </button>
      </form>
    </div>
    
    <!-- Messaggi di stato -->
    {#if error}
      <div class="message error">{error}</div>
    {/if}
    
    {#if message}
      <div class="message success">{message}</div>
    {/if}
    
    <!-- Lista dei prodotti -->
    <div class="product-list">
      <h2>Prodotti ({products.length})</h2>
      
      {#if loading && products.length === 0}
        <p class="loading">Caricamento prodotti...</p>
      {:else if products.length === 0}
        <p class="empty">Nessun prodotto disponibile</p>
      {:else}
        <ul>
          {#each products as product (product.id)}
            <li>
              <span class="product-name">{product.name}</span>
              <span class="product-price">${product.price}</span>
              <button
                class="delete-button"
                on:click={() => deleteProduct(product.id)}
                disabled={loading}
              >
                Elimina
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    
    <!-- Pulsante per ricaricare i prodotti -->
    <button class="reload-button" on:click={fetchProducts} disabled={loading}>
      {loading ? 'Caricamento...' : 'Ricarica Prodotti'}
    </button>
  </div>
  
  <style>
    .product-manager {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    h1, h2 {
      color: #333;
    }
    
    .add-product {
      margin-bottom: 20px;
    }
    
    .add-product form {
      display: flex;
      gap: 10px;
    }
    
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      padding: 8px 16px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    .message {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    
    .error {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #ef9a9a;
    }
    
    .success {
      background-color: #e8f5e9;
      color: #2e7d32;
      border: 1px solid #a5d6a7;
    }
    
    .product-list {
      margin: 20px 0;
    }
    
    ul {
      list-style-type: none;
      padding: 0;
    }
    
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .product-name {
      flex: 1;
    }
    
    .product-price {
      font-weight: bold;
      margin: 0 10px;
    }
    
    .delete-button {
      background-color: #f44336;
    }
    
    .loading, .empty {
      color: #757575;
      font-style: italic;
      text-align: center;
      padding: 20px 0;
    }
    
    .reload-button {
      width: 100%;
      margin-top: 20px;
      background-color: #2196f3;
    }
  </style>