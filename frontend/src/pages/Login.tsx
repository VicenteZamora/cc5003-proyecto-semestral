import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/login";

export default function LoginComponent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await login({ username, password });
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Credenciales incorrectas");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Iniciar sesión
        </h1>

        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 mb-4 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="username">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu usuario"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu contraseña"
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
            >
              Ingresar
            </button>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 cursor-pointer"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
