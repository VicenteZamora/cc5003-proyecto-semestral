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

  const handleGuideCreated = (newGuide: any) => {
    // Actualizar el juego con la nueva guía
    if (game) {
      setGame({
        ...game,
        guides: [...(game.guides || []), newGuide]
      });
    }
    
    console.log("Nueva guía creada:", newGuide);
  };

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

            {/* Descripción */}
            <div className="flex flex-wrap gap-4 mb-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {game.description}
              </p>
            </div>

            {/* Guías */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">
                Guías disponibles ({game.guides?.length || 0})
              </h2>
              {game.guides && game.guides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.guides.map((guide) => (
                    <Link
                      key={guide.id}
                      to={`/games/${id}/guides/${guide.id}`}
                      className="group bg-gray-900 border border-gray-700 rounded-lg p-5 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col min-h-[200px]"
                    >
                      {/* Contenido superior */}
                      <div className="flex-grow">
                        {/* Header con tags */}
                        {guide.tags && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {guide.tags.split(",").slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-600/30"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Título */}
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition line-clamp-2">
                          {guide.title}
                        </h3>

                        {/* Preview del contenido */}
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {guide.content}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                          <div className="flex items-center gap-2">
                            {/* Avatar */}
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {guide.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-gray-400 text-sm">
                              {guide.author?.username || 'Usuario'}
                            </span>
                          </div>

                          {/* Fecha */}
                          {guide.createdAt && (
                            <span className="text-gray-500 text-xs">
                              {new Date(guide.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>

                        {/* Indicador de hover */}
                        <div className="mt-3 flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                          <span>Ver guía completa</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-2">
                    No hay guías disponibles aún
                  </p>
                  <p className="text-gray-500 text-sm">
                    ¡Sé el primero en crear una guía para este juego!
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-white text-center text-xl mt-10">
            Cargando...
          </div>
        )}

        {/* Formulario para crear guía */}
        {id && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Crea una guía para {game?.name || "este juego"}
            </h2>
            <FormGuide gameId={id} onGuideCreated={handleGuideCreated} />
          </div>
        )}
      </div>
    </section>
  );
}

export default GameInfo;