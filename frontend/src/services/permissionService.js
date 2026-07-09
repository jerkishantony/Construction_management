import api from "../api/axios";

const permissionService = {
  getPermissions(roleId) {
    return api.get(`/admin/permissions/${roleId}`);
  },

  savePermissions(data) {
    return api.post("/admin/permissions/save-all", data);
  },

  getUserPermissions: (userId) =>
    api.get(`/admin/permissions/${userId}`),

};

export default permissionService;