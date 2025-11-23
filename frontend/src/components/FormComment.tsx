import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function FormComment({
  callback,
}: {
  callback?: (content: string) => void;
}) {
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const addComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      setError("Debes iniciar sesión para comentar");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    if (!content.trim()) {
      setError("El comentario no puede estar vacío");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (callback) {
        await callback(content);
        setContent("");
      }
    } catch (err: any) {
      console.error("Error al enviar comentario:", err);
      setError("Error al enviar el comentario. Inténtalo de nuevo.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4 text-center">
        <p className="text-yellow-500 mb-3">
          Debes iniciar sesión para comentar
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
    <form className="space-y-4" onSubmit={addComment}>
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Contenido del comentario */}
      <div>
        <label htmlFor="comment" className="block text-gray-300 mb-2 font-medium">
          Tu comentario <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          placeholder="Escribe tu comentario aquí..."
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
          className="w-full p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
          disabled={isSubmitting}
        />
        <p className="text-gray-500 text-xs mt-1">
          {content.length} caracteres
        </p>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </span>
          ) : (
            "Publicar comentario"
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setContent("");
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