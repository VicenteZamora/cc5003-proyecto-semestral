import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Guide } from "../interfaces";

interface FormGuideProps {
  gameId: string;
  onGuideCreated?: (guide: Guide) => void;
}

export function FormGuide({ gameId, onGuideCreated }: FormGuideProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para crear una guía");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("El título y contenido son obligatorios");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/guides", {
        title: title.trim(),
        content: content.trim(),
        tags: tags.trim() || "General",
        game: gameId,
      });

      const newGuide = response.data;
      
      setSuccess(true);
      setTitle("");
      setContent("");
      setTags("");
      
      if (onGuideCreated) {
        onGuideCreated(newGuide);
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error creating guide:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error al crear la guía";
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-center">
        <p className="text-yellow-500 mb-3">
          Debes iniciar sesión para crear una guía
        </p>
        <button
          onClick={() => navigate("/login")}
          className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensajes */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-3">
          <p className="text-green-500 text-sm">¡Guía creada exitosamente! 🎉</p>
        </div>
      )}

      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-gray-300 mb-2 font-medium">
          Título de la guía <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Guía completa para principiantes"
          className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
          maxLength={100}
        />
        <p className="text-gray-500 text-xs mt-1">{title.length}/100 caracteres</p>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-gray-300 mb-2 font-medium">
          Etiquetas
        </label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Ej: Principiantes, Tutorial, Consejos (separados por comas)"
          className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <p className="text-gray-500 text-xs mt-1">
          Separa las etiquetas con comas
        </p>
      </div>

      {/* Contenido */}
      <div>
        <label htmlFor="content" className="block text-gray-300 mb-2 font-medium">
          Contenido de la guía <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe el contenido de tu guía aquí..."
          className="w-full px-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y"
          disabled={isSubmitting}
        />
        <p className="text-gray-500 text-xs mt-1">
          {content.length} caracteres
        </p>
      </div>

      {/* Botón de envío */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creando...
            </span>
          ) : (
            "Crear guía"
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
            setTags("");
            setError(null);
          }}
          disabled={isSubmitting}
          className="cursor-pointer px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}