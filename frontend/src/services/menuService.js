import api from "../api/axios";

const menuService = {
  getMenus() {
    return api.get("/admin/menus/");
  },
};

export default menuService;