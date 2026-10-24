export default function ProductCard({ game, onDelete }) {
  return (
    <div className="card">
      <img src={game.image} alt={game.title} />
      <div className="card-body">
        <span className="genre">{game.genre}</span>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <div className="rating">Rating: {game.rating}</div>
        <div className="price">{game.price} rub</div>
        <button className="btn-delete" onClick={() => onDelete(game._id)}>Delete</button>
      </div>
    </div>
  );
}
