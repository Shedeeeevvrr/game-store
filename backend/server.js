require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/gamestore')
  .then(() => console.log('MongoDB OK'))
  .catch(err => console.error('MongoDB error:', err));
const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  price: { type: Number, required: true },
  genre: String,
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const Game = mongoose.model('Game', gameSchema);
(async () => {
  if (await Game.countDocuments() === 0) {
    await Game.insertMany([
      { title: 'The Witcher 3', description: 'RPG в открытом мире', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', price: 999, genre: 'RPG', rating: 9.5 },
      { title: 'Cyberpunk 2077', description: 'Экшен в будущем', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400', price: 1499, genre: 'Action', rating: 8.2 },
      { title: 'Elden Ring', description: 'Souls-like RPG', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', price: 1999, genre: 'RPG', rating: 9.7 },
      { title: 'Hades', description: 'Рогалик', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400', price: 599, genre: 'Indie', rating: 9.3 },
      { title: 'Stardew Valley', description: 'Фермерский симулятор', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400', price: 299, genre: 'Indie', rating: 9.0 }
    ]);
    console.log('DB seeded');
  }
})();
app.get('/api/games', async (req, res) => {
  try {
    const { search, genre, sort } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (genre && genre !== 'all') filter.genre = genre;
    let query = Game.find(filter);
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'rating') query = query.sort({ rating: -1 });
    res.json(await query);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/games/:id', async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ error: 'Not found' });
  res.json(game);
});
app.post('/api/games', async (req, res) => {
  try { res.status(201).json(await Game.create(req.body)); }
  catch (e) { res.status(400).json({ error: e.message }); }
});
app.delete('/api/games/:id', async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});
app.listen(3001, () => console.log('Backend on 3001'));
