import axios from "axios";

type Credentials = {
  username: string;
  email: string;
  password: string;
};

export const register = async (credentials: Credentials) => {
  const response = await axios.post("/api/users", credentials);

  return response.data;
};
