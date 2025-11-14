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
    <nav className="bg-amber-400 shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* nombre */}
        <Link to="/" className="text-xl font-bold text-white hover:text-gray-100 transition">
          Hito 1
        </Link>

        {/* links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-white hover:text-gray-100 font-medium transition duration-300"
          >
            Juegos
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="text-white hover:text-gray-100 font-medium transition duration-300"
              >
                {user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}