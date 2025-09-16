import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="bg-amber-400 shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* nombre */}
        <Link to="/" className="text-xl font-bold text-white hover:text-gray-100 transition">
          Hito 1
        </Link>

        {/* links */}
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-white hover:text-gray-100 font-medium transition duration-300"
          >
            Juegos
          </Link>
          <Link
            to="/guides"
            className="text-white hover:text-gray-100 font-medium transition duration-300"
          >
            Perfil
          </Link>
        </div>
      </div>
    </nav>
  );
}
