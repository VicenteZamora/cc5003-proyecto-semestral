import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Comment, Guide } from "../interfaces";
import { FormGuide } from "./FormGuide";

function GuideComponent() {
  const id = useParams().guideId;
  const [guide, setGuide] = useState<Guide | null>(null);
  const [comments, setComments] = useState<Array<Comment>>([]);

  const addComment = (content: string) => {
    const comment = { content, author: "tbi" };
    setComments([...comments, comment]);
  };

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
            <h1 className="text-3xl font-bold text-white mb-6">
              {guide.title}
            </h1>

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
        {comments.length > 0 && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto text-white">
            <h1 className="text-3xl font-bold text-white mb-6">Comentarios</h1>
            {comments.map((c) => (
              <div className="bg-gray-900 rounded-md shadow-lg my-2 px-2 w-full mx-auto text-white">
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        )}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Comenta</h1>
          <FormGuide callback={addComment} />
        </div>
      </div>
    </section>
  );
}

export default GuideComponent;
