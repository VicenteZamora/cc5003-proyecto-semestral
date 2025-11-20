import axios from "axios";

axios.defaults.withCredentials = true;

type Credentials = {
  username: string;
  password: string;
};

export const login = async (credentials: Credentials) => {
  const response = await axios.post("/api/login", credentials);

  const csrfToken = response.headers["x-csrf-token"];
  if (csrfToken) {
    localStorage.setItem("csrfToken", csrfToken);

  } else {
    console.error("No se recibió CSRF token en los headers");
  }

  return {
    username: response.data.username,
    csrfToken
  };
};