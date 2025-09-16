import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <section className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-300 text-xl mb-6">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition transform hover:scale-105"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
