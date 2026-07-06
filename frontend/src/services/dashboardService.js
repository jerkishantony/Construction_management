import api from "../api/axios";

const dashboardService = {
  getAdminDashboard() {
    return api.get("/admin/dashboard");
  }
};

export default dashboardService;