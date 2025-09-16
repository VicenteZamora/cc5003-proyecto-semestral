import axios from "axios";
import { useEffect, useState } from "react";
import type { Game } from "../interfaces";
import GameComponent from "../components/GameComponent";

function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;

  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((res) => setGames(res.data))
      .catch((err) => console.error(err));
  }, []);

  const displayedGames = showAll ? games : games.slice(0, initialCount);

  return (
    <section className="py-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-4">
          {displayedGames.map((game) => (
            <GameComponent key={game.id} game={game} />
          ))}
        </div>

        {games.length > initialCount && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition transform hover:scale-105 duration-300 cursor-pointer"
            >
              {showAll ? "Mostrar menos" : "Mostrar más"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default GamesList;
