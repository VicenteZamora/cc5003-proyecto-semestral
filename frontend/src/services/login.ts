import axios from "axios";

type Credentials = {
  username: string;
  password: string;
};

export const login = async (credentials: Credentials) => {
  const response = await axios.post("/api/login", credentials);

  const csrfToken = response.headers["x-csrf-token"];

  if (csrfToken) {
    localStorage.setItem("csrfToken", csrfToken);
  }

  return response.data;
};
