import api from "../api/axios";

const roleService = {
  getRoles() {
    return api.get("/admin/roles/");
  },
};

export default roleService;