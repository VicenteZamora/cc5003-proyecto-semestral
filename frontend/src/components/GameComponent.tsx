import { Link } from "react-router-dom";
import type { Game } from "../interfaces";

export default function GameComponent({ game }: { game: Game }) {
  return (
    <div className="overflow-hidden rounded-lg aspect-square cursor-pointer transition-transform duration-400 transform hover:scale-105">
      <Link to={`/games/${game.id}`}>
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
}
