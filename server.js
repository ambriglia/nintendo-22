import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from "express";
import morgan from 'morgan';
import { Low, JSONFile } from 'lowdb';

// DB setup
const __dirname = dirname(fileURLToPath(import.meta.url));

const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize express web server
const app = express();

// Configure express with middleware
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Custom middleware
app.use((req, res, next) => {
  console.log('Hello from middleware!');
  next();
});

// Route functions
app.get('/api/characters', async (req, res) => {
  await db.read();
  res.json(db.data);
});

app.post('/api/characters', async (req, res) => {
  console.log(req.body);
  db.data.characters.push(req.body);
  await db.write();
  res.json(db.data);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
