import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Comment, Guide } from "../interfaces";
import { FormComment } from "./FormComment";

function GuideComponent() {
  const id = useParams().guideId;
  const [guide, setGuide] = useState<Guide | null>(null);
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/login/me", {
          withCredentials: true,
          validateStatus: (status) => status >= 200 && status < 500,
        });
        
        if (res.status === 200) {
          setCurrentUser(res.data);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        setCurrentUser(null);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const addComment = async (content: string) => {    
    try {
      const res = await axios.post(
        `/api/posts/guide/${id}`, 
        { content },
        { withCredentials: true }
      );

      const newComment = res.data;
      setComments((prev) => [...prev, newComment]);
    } catch (error) {
      console.error("Error adding a comment", error);
      if (axios.isAxiosError(error)) {
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        alert(error.response?.data?.error || "Error al agregar el comentario");
      }
    }
  };

  // Función para iniciar la edición
  const startEdit = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Función para cancelar la edición
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Función para guardar la edición
  const saveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      alert("El comentario no puede estar vacío");
      return;
    }

    try {
      const res = await axios.put(
        `/api/posts/${commentId}`,
        { content: editContent },
        { withCredentials: true }
      );

      // Actualizar el comentario en la lista
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId 
            ? { ...comment, content: res.data.content } 
            : comment
        )
      );
      
      setEditingCommentId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error al actualizar el comentario");
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

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Verificar si el usuario actual es el autor del comentario
  const isCommentAuthor = (comment: Comment) => {
    if (!currentUser || !comment.author) return false;
    const authorId = comment.author.id || comment.author._id;
    return authorId === currentUser.id;
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
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Error loading comments:", err));

  }, [id]);

  // Función para confirmar eliminación
  const confirmDelete = async (commentId: string) => {
    try {
      await axios.delete(`/api/posts/${commentId}`, {
        withCredentials: true,
      });

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setDeletingCommentId(null);
    } catch (error) {
      console.error("Error deleting comment", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.error || "Error al eliminar el comentario");
      }
      setDeletingCommentId(null);
    }
  };

  // Función para cancelar eliminación
  const cancelDelete = () => {
    setDeletingCommentId(null);
  };

  return (
    <section className="py-20 bg-gray-900 min-h-screen">
      <div className="container mx-auto px-6 space-y-6">
        {guide ? (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            {/* Header con autor y fecha */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
              <div className="flex items-center gap-3">
                {/* Avatar del autor */}
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {guide.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                
                <div className="flex flex-col">
                  {/* Nombre del autor */}
                  <span className="text-blue-400 font-semibold hover:text-blue-300 transition">
                    {guide.author?.username || 'Usuario'}
                  </span>
                  
                  {/* Fecha de creación */}
                  {guide.createdAt && (
                    <span className="text-gray-400 text-sm">
                      {formatDate(guide.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

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
            Cargando...
          </div>
        )}

        {/* Formulario de comentarios */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Añadir comentario</h2>
          <FormComment callback={addComment} />
        </div>

        {/* Sección de comentarios */}
        {comments.length > 0 && (
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              Comentarios ({comments.length})
            </h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition relative"
                >
                  {/* Overlay de confirmación de eliminación */}
                  {deletingCommentId === comment.id && (
                      <div className="absolute inset-0 bg-gray-900 border-2 border-red-500 rounded-lg p-4 flex flex-col items-center justify-center gap-4 z-10">                      <p className="text-red-400 text-center font-medium">
                        ¿Estás seguro de que quieres eliminar este comentario?
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => confirmDelete(comment.id)}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Header del comentario */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      
                      <span className="text-blue-400 font-semibold hover:text-blue-300 transition">
                        {comment.author?.username || 'Usuario'}
                      </span>
                      
                      <span className="text-gray-600">•</span>
                      
                      <span className="text-gray-400 text-sm">
                        {comment.createdAt ? formatDate(comment.createdAt) : 'Fecha desconocida'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-mono">
                        #{comment.id?.toString().slice(-6) || 'ID'}
                      </span>

                      {isCommentAuthor(comment) && editingCommentId !== comment.id && (
                        <div className="flex gap-2 ml-3">
                          <button
                            onClick={() => startEdit(comment)}
                            className="cursor-pointer text-white hover:text-white-300 transition text-sm font-medium px-2 py-1 rounded hover:bg-gray-800"
                            title="Editar comentario"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeletingCommentId(comment.id)} // ✅ Cambio aquí
                            className="cursor-pointer text-red-400 hover:text-red-300 transition text-sm font-medium px-2 py-1 rounded hover:bg-gray-800"
                            title="Eliminar comentario"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contenido del comentario o formulario de edición */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                        rows={3}
                        placeholder="Edita tu comentario..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>
                  )}
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
