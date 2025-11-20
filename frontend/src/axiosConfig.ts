import axios from "axios";

// Configurar axios para enviar cookies automáticamente
axios.defaults.withCredentials = true;

// Interceptor para añadir el CSRF token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem("csrfToken");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo redirigir al login si es un error 401 en rutas protegidas
    // Y NO es el endpoint de login o logout
    if (
      error.response?.status === 401 && 
      !error.config?.url?.includes('/login')
    ) {

      // Limpiar tokens y redirigir al login
      localStorage.removeItem("csrfToken");
      localStorage.removeItem("username");
      
      // Solo redirigir si no estamos ya en /login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;