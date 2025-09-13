import axios from "axios";
import { useEffect, useState } from "react";
import type { Game } from "../interfaces";
import GameComponent from "../components/GameComponent";

function GamesList() {
  const [games, setGames] = useState<Array<Game>>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/games")
      .then((json) => setGames(json.data));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {games.map((g) => (
          <GameComponent game={g} />
      ))}
    </div>
  );
}

export default GamesList;