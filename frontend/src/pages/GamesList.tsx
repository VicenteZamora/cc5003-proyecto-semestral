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
    <>
      {games.map((g) => (
        <GameComponent game={g} />
      ))}
    </>
  );
}

export default GamesList;