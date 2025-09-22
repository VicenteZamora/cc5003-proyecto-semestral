import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Guide } from "../interfaces";
import { FormGuide } from "./FormGuide";

function GuideComponent() {
  const { id } = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/guides/${id}`)
      .then((res) => setGuide(res.data))
      .catch((err) => {
        console.error(err);
        setGuide(null);
      });
  }, [id]);

  return (
    <section className="py-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6 space-y-6">
        {guide ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            {/* Tags */}
            {guide.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {guide.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-700 transition transform hover:scale-105"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Título */}
            <h1 className="text-3xl font-bold text-white mb-6">{guide.title}</h1>

            {/* Contenido */}
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {guide.content}
            </p>
          </div>
        ) : (
          <div className="text-white text-center text-xl mt-10">
            NO ENCONTRADO
          </div>
        )}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Comenta</h1>
            <FormGuide />
        </div>
      </div>
    </section>
  );
}

export default GuideComponent;
