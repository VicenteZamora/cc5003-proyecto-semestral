import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Comment, Guide } from "../interfaces";
import { FormComment } from "./FormComment";

function GuideComponent() {
  const id = useParams().guideId;
  const [guide, setGuide] = useState<Guide | null>(null);
  const [comments, setComments] = useState<Array<Comment>>([]);

  const addComment = async (content: string) => {    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/posts/guide/${id}`, 
        { content },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = res.data;
      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.error("Error adding a comment", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
      }
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Hace X minutos/horas/días
    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    // Fecha formateada
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  useEffect(() => {
    axios
      .get(`/api/guides/${id}`)
      .then((res) => setGuide(res.data))
      .catch((err) => {
        console.error(err);
        setGuide(null);
      });

    axios
      .get(`/api/posts/guide/${id}`)
      .then((res) => setComments(res.data));

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

        {/* Formulario de comentarios */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Añadir comentario</h2>
          <FormComment callback={addComment} />
        </div>

        {/* Sección de comentarios mejorada */}
        {comments.length > 0 && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Comentarios ({comments.length})
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition"
                >
                  {/* Header del comentario */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      {/* Avatar placeholder */}
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      
                      {/* Usuario */}
                      <span className="text-blue-400 font-semibold hover:text-blue-300 transition">
                        {comment.author?.username || 'Usuario'}
                      </span>
                      
                      {/* Separador */}
                      <span className="text-gray-600">•</span>
                      
                      {/* Fecha */}
                      <span className="text-gray-400 text-sm">
                        {comment.createdAt ? formatDate(comment.createdAt) : 'Fecha desconocida'}
                      </span>
                    </div>
                    
                    {/* ID del comentario */}
                    <span className="text-gray-500 text-xs font-mono">
                      #{comment.id?.toString().slice(-6) || 'ID'}
                    </span>
                  </div>
                  
                  {/* Contenido del comentario */}
                  <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default GuideComponent;