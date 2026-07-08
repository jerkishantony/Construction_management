import api from "../api/axios";

const menuService = {
  getMenus() {
    return api.get("/admin/menus/");
  },

  updateShowAllMenus(data) {
    return api.put("/admin/menus/show-all-menus", data);
  },
};

export default menuService;