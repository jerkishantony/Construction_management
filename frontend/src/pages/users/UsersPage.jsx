import { useEffect, useState } from "react";
import DeleteUserDialog from "../../components/users/DeleteUserDialog";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import UsersTable from "../../components/tables/UsersTable";
import UserDialog from "../../components/users/UserDialog";
import userService from "../../services/userService";

export default function UsersPage() {
    const [deleteOpen, setDeleteOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [selectedUser, setSelectedUser] = useState(null);

  // ==========================
  // Load Users
  // ==========================
  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await userService.getUsers();

      const data = response.data.users || response.data;

      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);
// delete
const handleDelete = (user) => {
  setSelectedUser(user);
  setDeleteOpen(true);
};
  // ==========================
  // Search
  // ==========================
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredUsers(
      users.filter((user) =>
        Object.values(user)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [search, users]);

  // ==========================
  // Create
  // ==========================
  const handleCreate = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setDialogOpen(true);
  };

  // ==========================
  // Edit
  // ==========================
  const handleEdit = (user) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setDialogOpen(true);
  };

return (
  <Box sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}>
    <Card
      sx={{
        borderRadius: 3,
        mb: 3,
        boxShadow: 3,
        width: "100%",
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
          sx={{ minWidth: 0 }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              whiteSpace: "normal",
              wordBreak: "break-word",
            }}
          >
            Users Management
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            <TextField
              size="small"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 260 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{ width: { xs: "100%", sm: "auto" }, whiteSpace: "nowrap" }}
            >
              Create User
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>

    <UsersTable
      users={filteredUsers}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />

    <UserDialog
      open={dialogOpen}
      mode={dialogMode}
      user={selectedUser}
      onClose={() => setDialogOpen(false)}
      onSuccess={loadUsers}
    />

    <DeleteUserDialog
      open={deleteOpen}
      user={selectedUser}
      onClose={() => setDeleteOpen(false)}
      onSuccess={loadUsers}
    />
  </Box>
);
  <DeleteUserDialog
  open={deleteOpen}
  user={selectedUser}
  onClose={() => setDeleteOpen(false)}
  onSuccess={loadUsers}
/>
}