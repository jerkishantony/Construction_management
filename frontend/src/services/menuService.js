import api from "../api/axios";

const menuService = {
  // Admin
  getMenus() {
    return api.get("/admin/menus/");
  },

  updateShowAllMenus(data) {
    return api.put("/admin/menus/show-all-menus", data);
  },

  // User
  getMyMenus() {
    return api.get("/user/my-menus");
  },
};

export default menuService;