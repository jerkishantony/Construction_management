import api from "../api/axios";

const settingsService = {
  getSettings() {
    return api.get("/settings/");
  },

  updateSettings(data) {
    return api.put("/settings/", data);
  },
};

export default settingsService;