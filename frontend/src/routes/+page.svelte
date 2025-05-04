<script>
    let products = $state([]);
    let newProductName = $state('');
    
    const API_URL = 'http://localhost:3000/products';
    
    async function fetchProducts() {
          try {
            // In un'applicazione reale, questa sarebbe una vera chiamata API
            const response = await fetch(API_URL);
            
            if (!response.ok) {
              throw new Error(`Errore HTTP: ${response.status}`);
            }
            
            // Aggiorna lo stato con i dati ricevuti
            products = await response.json();
          } catch (err) {
                 console.log(err);
          }
    }
    
    
    
    
    async function addProduct() {
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
            
            // Otteniamo il prodotto con l'ID assegnato dal server (riga 37 del backend)
            const savedProduct = await response.json();
            
            // Aggiorniamo lo stato locale aggiungendo il nuovo prodotto
            products = [...products, savedProduct];
            
            // Reset del form
            newProductName = '';
            message = 'Prodotto aggiunto con successo!';
          } catch (err) {
                 console.log(err);
          }
    }
    
    </script>
    
    
    <form onsubmit={addProduct}>
            <input
              type="text"
              placeholder="Nome del prodotto"
              bind:value={newProductName}
            />
            <button type="submit">
              {loading ? 'Caricamento...' : 'Aggiungi Prodotto'}
            </button>
          </form>