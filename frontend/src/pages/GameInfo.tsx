import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Game } from "../interfaces";
import { FormGuide } from "../components/FormGuide";

function GameInfo() {
  const { id } = useParams();
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    axios
      .get(`/api/games/${id}`)
      .then((json) => setGame(json.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <section className="py-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6 space-y-6">
        {game ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            {/* Nombre del juego */}
            <h1 className="text-3xl font-bold text-white mb-4">{game.name}</h1>

            {/* Género y plataforma */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full">
                {game.genre}
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full">
                {game.platform}
              </span>
            </div>
            {/* Descripcion */}
            <div className="flex flex-wrap gap-4 mb-6">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {game.description}
            </p>
            </div>
            {/* Guías */}
            {game.guides && game.guides.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {game.guides.map((guide) => (
                  <Link
                    key={guide.id}
                    to={`/games/${id}/guides/${guide.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition transform hover:scale-105"
                  >
                    {guide.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-white text-center text-xl mt-10">
          </div>
        )}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Crea una guía</h1>
            <FormGuide />
        </div>
      </div>
    </section>
  );
}

export default GameInfo;
