import api from "../api/axios";

const userService = {
  getUsers: () => api.get("/admin/users/"),

  getUser: (id) => api.get(`/admin/users/${id}`),

  createUser: (data) => api.post("/admin/users/create", data),

  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),

  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  updateStatus: (id, data) =>
    api.patch(`/admin/users/${id}/status`, data),

  assignRole: (data) =>
    api.post("/admin/users/assign-role", data),
};

export default userService;