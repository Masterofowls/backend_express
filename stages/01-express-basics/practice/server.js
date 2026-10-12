import express from 'express';

const app = express();
const PORT = 9001;

app.use(express.json());

let nextId = 4;
const products = [
  { id: 1, name: 'Keyboard', price: 79 },
  { id: 2, name: 'Mouse', price: 29 },
  { id: 3, name: 'Monitor', price: 199 },
];

// TODO 1: GET / → { message: "Welcome to Stage 01" }
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Stage 01' });
});

// TODO 2: GET /health → { ok: true }
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// TODO 3: GET /products → products array
app.get('/products', (req, res) => {
  res.json(products);
});

// TODO 4: GET /products/:id → product or 404
app.get('/products/:id', (req, res) => {
  // req.params.id is always a string → convert before compare
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return; // stop — do not send a second response
  }

  res.json(product); // 200 by default
});

// TODO 5: POST /products → create product
app.post('/products', (req, res) => {
  const { name, price } = req.body ?? {};

  if (!name || price === undefined) {
    res.status(400).json({ error: 'name and price required' });
    return;
  }

  const product = { id: nextId++, name, price: Number(price) };
  products.push(product);
  res.status(201).json(product); // 201 = Created
});

// TODO 6: 404 fallback — must be AFTER all real routes
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});


app.listen(PORT, () => {
  console.log(`Stage 01 practice on http://localhost:${PORT}`);
});
