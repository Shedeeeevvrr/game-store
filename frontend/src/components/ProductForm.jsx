import { useState } from 'react';
export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', image: '', price: '', genre: 'RPG', rating: 8 });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: Number(form.price), rating: Number(form.rating) });
  };
  return (
    <form className="form" onSubmit={handleSubmit}>
      <input placeholder="Название" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
      <textarea placeholder="Описание" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
      <input placeholder="URL изображения" value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
      <input type="number" placeholder="Цена" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
      <select value={form.genre} onChange={e => setForm({...form, genre: e.target.value})}>
        <option value="RPG">RPG</option>
        <option value="Action">Action</option>
        <option value="Indie">Indie</option>
      </select>
      <input type="number" step="0.1" placeholder="Рейтинг" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} />
      <button type="submit" className="btn-primary">Сохранить</button>
    </form>
  );
}
