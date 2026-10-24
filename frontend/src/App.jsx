import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard.jsx';
import ProductForm from './components/ProductForm.jsx';
const API = '/api/games';
export default function App() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [sort, setSort] = useState('');
  const [showForm, setShowForm] = useState(false);
  const loadGames = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (genre !== 'all') params.append('genre', genre);
    if (sort) params.append('sort', sort);
    try {
      const res = await fetch(API + '?' + params);
      setGames(await res.json());
    } catch (e) { console.error(e); }
  };
  useEffect(() => { loadGames(); }, [search, genre, sort]);
  const handleDelete = async (id) => {
    await fetch(API + '/' + id, { method: 'DELETE' });
    loadGames();
  };
  const handleAdd = async (data) => {
    await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    setShowForm(false);
    loadGames();
  };
  return (
    <div className="container">
      <header><h1>Game Store</h1><p>Каталог игр</p></header>
      <div className="toolbar">
        <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={genre} onChange={e => setGenre(e.target.value)}>
          <option value="all">Все жанры</option>
          <option value="RPG">RPG</option>
          <option value="Action">Action</option>
          <option value="Indie">Indie</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Сортировка</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="rating">По рейтингу</option>
        </select>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Закрыть' : '+ Добавить'}
        </button>
      </div>
      {showForm && <ProductForm onSubmit={handleAdd} />}
      <div className="grid">
        {games.map(g => <ProductCard key={g._id} game={g} onDelete={handleDelete} />)}
        {games.length === 0 && <p className="empty">Ничего не найдено</p>}
      </div>
    </div>
  );
}
