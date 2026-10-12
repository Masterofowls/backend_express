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

app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Stage 01' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/products', (_req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price } = req.body ?? {};

  if (!name || price === undefined) {
    res.status(400).json({ error: 'name and price required' });
    return;
  }

  const product = { id: nextId++, name, price: Number(price) };
  products.push(product);
  res.status(201).json(product);
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Stage 01 solution on http://localhost:${PORT}`);
});
