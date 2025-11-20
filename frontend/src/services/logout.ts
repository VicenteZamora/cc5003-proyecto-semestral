import axios from "axios";

export const logout = async () => {
  try {
    await axios.post("/api/login/logout");
    localStorage.removeItem("csrfToken");
    
  } catch (error) {
    console.error("Error en logout:", error);

    localStorage.removeItem("csrfToken");
    throw error;
  }
};