import type { Game } from "../interfaces";
import { Link } from "react-router-dom";

function GameComponent({ game }: { game: Game }) {
  return (
    <div className="group cursor-pointer relative">
      <Link
        to={`/games/${game.id}`}
      >
        <div className="group cursor-pointer relative">
          <img
            src={game.image}
            alt={game.name}
            className="bg-gray-800 w-full h-48 object-cover rounded-lg transition-transform transform scale-100 group-hover:scale-105"
          />
        </div>
      </Link>
    </div>
  );
}

export default GameComponent;

