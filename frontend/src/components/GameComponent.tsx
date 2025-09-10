import type { Game } from "../interfaces";
import { Link } from "react-router-dom";

function GameComponent({ game }: { game: Game }) {
  return (
    // Prueba, la idea es que las img sean cuadradas para no pelear con los width y height
    <Link to={`/games/${game.id}`} className="game-card">
      <img src={game.image} alt={game.name} style={{ width: "10%", height: "auto" }} />
    </Link>
  );
}

export default GameComponent;
