import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/register";

export default function RegisterComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await register({ username, email, password });
      setUsername("");
      setEmail("");
      setPassword("");
      navigate("/login"); // redirige al login después de registrar
    } catch (exception) {
      setErrorMessage("Error al crear la cuenta");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Crear cuenta
        </h1>

        {errorMessage && (
          <div className="bg-red-500 text-white text-center py-2 mb-4 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
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
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="w-full px-4 py-2 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tucorreo@ejemplo.com"
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
              Registrarse
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 cursor-pointer"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
