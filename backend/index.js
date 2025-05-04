const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database simulato
let products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Smartphone', price: 699 },
  { id: 3, name: 'Tablet', price: 399 }
];
let nextId = 4;

// GET - Recupera tutti i prodotti
app.get('/products', (req, res) => {
  res.json(products);
});

// POST - Aggiungi un nuovo prodotto
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Nome e prezzo sono obbligatori' });
  }
  
  const newProduct = {
    id: nextId++,
    name,
    price
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE - Elimina un prodotto
app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  
  products = products.filter(product => product.id !== id);
  
  if (products.length === initialLength) {
    return res.status(404).json({ error: 'Prodotto non trovato' });
  }
  
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});