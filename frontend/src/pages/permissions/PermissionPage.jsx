import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import api from "../../api/axios";
import PermissionTable from "../../components/permission/PermissionTable";

const DEFAULT_PERMISSION = {
  can_view: false,
  can_create: false,
  can_edit: false,
  can_delete: false,
};

export default function PermissionPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [menus, setMenus] = useState([]);

  const [permissions, setPermissions] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadPermissions(selectedUser);
    } else {
      setMenus([]);
      setPermissions({});
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      // Some APIs return a bare array, others wrap it in { data: [...] }
      // or { users: [...] }. Handle the common shapes instead of assuming.
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.users ?? [];

      if (!Array.isArray(list) || list.length === 0) {
        console.warn("Users response was empty or unexpected shape:", res.data);
      }

      setUsers(list);
    } catch (err) {
      console.error("Failed to load users:", err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to load users",
      });
    }
  };

  const loadPermissions = async (userId) => {
    setLoading(true);
    // Clear stale data from a previously selected user immediately,
    // so the table doesn't briefly show the wrong user's data.
    setMenus([]);
    setPermissions({});

    try {
      const res = await api.get(`/admin/permissions/${userId}`);

      // The API returns the full menu list already merged with this
      // user's permission flags (menu_id, menu_name, menu_key, can_view...).
      // Use it directly as both the menu list and the permission source
      // instead of relying on a separate /admin/menus/all call.
      const rows = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.permissions ?? [];

      const map = {};
      rows.forEach((item) => {
        map[item.menu_id] = {
          can_view: !!item.can_view,
          can_create: !!item.can_create,
          can_edit: !!item.can_edit,
          can_delete: !!item.can_delete,
        };
      });

      setMenus(rows);
      setPermissions(map);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to load permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (menuId, field) => {
    setPermissions((prev) => {
      const current = prev[menuId] || DEFAULT_PERMISSION;

      return {
        ...prev,
        [menuId]: {
          ...current,
          [field]: !current[field],
        },
      };
    });
  };

 const handleSave = async () => {
  setSaving(true);

  try {
    // Find the selected user object
   const user = users.find((u) => u.id === selectedUser);

const payload = {
  role_id: user.role === "admin" ? 1 : 2,
  user_id: user.id,
  permissions: menus.map((menu) => {
    const menuId = menu.id ?? menu.menu_id;
    const permission = permissions[menuId] || DEFAULT_PERMISSION;

    return {
      menu_id: menuId,
      can_view: permission.can_view,
      can_create: permission.can_create,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete,
    };
  }),
};

console.log(payload);

await api.post("/admin/permissions/save-all", payload);

    setSnackbar({
      open: true,
      severity: "success",
      message: "Permissions updated successfully",
    });
  } catch (err) {
    console.error(err);

    setSnackbar({
      open: true,
      severity: "error",
      message: "Failed to save permissions",
    });
  } finally {
    setSaving(false);
  }
};

  const handleSnackbarClose = (_event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Permission Management
        </Typography>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUser}
                label="Select User"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {selectedUser && (
          <>
            {loading ? (
              <Box display="flex" justifyContent="center" py={5}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <PermissionTable
                  menus={menus}
                  permissions={permissions}
                  onPermissionChange={handlePermissionChange}
                />

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Permissions"}
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={handleSnackbarClose}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}