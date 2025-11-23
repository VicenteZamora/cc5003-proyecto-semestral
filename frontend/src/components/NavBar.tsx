import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo y nombre */}
        <Link 
          to="/" 
          className="flex items-center gap-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300"
        >
          {/* Icono de juego */}
          <span className="text-3xl">🎮</span>
          <span>GameGuides</span>
        </Link>

        {/* Links de navegación */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-300 hover:text-white font-medium transition-all duration-300 relative group"
          >
            Juegos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {isAuthenticated ? (
            <>
              {/* Perfil de usuario */}
              <Link
                to="/profile"
                className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-all duration-300 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span>{user?.username}</span>
              </Link>

              {/* Botón de cerrar sesión */}
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-red-500/90 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}