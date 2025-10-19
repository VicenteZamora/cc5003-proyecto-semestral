import axios from "axios";

type Credentials = {
  username: string;
  email: string;
  password: string;
};

export const register = async (credentials: Credentials) => {
  const response = await axios.post("/api/register", credentials);

  return response.data;
};
