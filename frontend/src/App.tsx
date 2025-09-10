import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import type { Game, Guide } from "./interfaces";

function GameComponent({ game }: { game: Game }) {
  return (
    <div>
      <p>{game.name} </p>
    </div>
  );
}

function GuideComponent() {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide>();
  useEffect(() => {
    axios
      .get(`http://localhost:3001/guides/${id}`)
      .then((json) => setGuide(json.data))
      .catch((err) => console.log(err));
  }, [id]);
  return (
    <>
      {guide ? (
        <div>
          <p>{guide.tags} </p>
          <p>{guide.title} </p>
          <p> {guide.content}</p>
        </div>
      ) : (
        <div>NO ENCONTRADO</div>
      )}
    </>
  );
}

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamesList />} />
        <Route path="/games/:id" element={<GameInfo />} />
        <Route path="/guides/:id" element={<GuideComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
