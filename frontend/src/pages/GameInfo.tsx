import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Game } from "../interfaces";

function GameInfo() {
  const { id } = useParams();
  const [game, setGame] = useState<Game>();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/games/${id}`)
      .then((json) => setGame(json.data))
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <>
      {game ? (
        <div>
          <p>{game.name} </p>
          <p>{game.genre} </p>
          <p> {game.platform}</p>
          {game.guides.map((guideId) => (
            <div>
              <Link to={`/guides/${guideId}`}>{guideId}</Link>
            </div>
          ))}
        </div>
      ) : (
        <div>NO ENCONTRADO</div>
      )}
    </>
  );
}

export default GameInfo;