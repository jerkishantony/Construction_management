import api from "../api/axios";

const authService = {
  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    localStorage.removeItem("role_id");
  },
};

export default authService;