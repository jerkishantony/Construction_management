import api from "../api/axios";

const profileService = {
  getProfile: () => api.get("/profile/"),
};

export default profileService;