const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

let favorites = [];

// Get all favorites
app.get('/favorites', (req, res) => {
  res.json(favorites);
});

// Add a favorite
app.post('/favorites', (req, res) => {
  const favorite = req.body;
  if (!favorite || !favorite.id) {
    return res.status(400).json({ error: 'Favorite must have an id' });
  }
  // Avoid duplicates
  if (!favorites.find(fav => fav.id === favorite.id)) {
    favorites.push(favorite);
  }
  res.status(201).json(favorite);
});

// Remove a favorite
app.delete('/favorites/:id', (req, res) => {
  const id = req.params.id;
  favorites = favorites.filter(fav => fav.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
