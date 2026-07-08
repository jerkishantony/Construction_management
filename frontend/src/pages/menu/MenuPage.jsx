import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import MenuTable from "../../components/menu/MenuTable";
import menuService from "../../services/menuService";

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [showAllMenus, setShowAllMenus] = useState(false);

  // ==========================
  // Load Menus
  // ==========================

  const loadMenus = async () => {
    try {
      setLoading(true);

      const response = await menuService.getMenus();

      const data = response.data.data || [];

      setMenus(data);
      setFilteredMenus(data);

      // Backend should return this value
      setShowAllMenus(response.data.show_all_menus ?? false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // ==========================
  // Search
  // ==========================

  useEffect(() => {
    if (!search.trim()) {
      setFilteredMenus(menus);
      return;
    }

    const keyword = search.toLowerCase();

    setFilteredMenus(
      menus.filter((menu) =>
        Object.values(menu)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
    );
  }, [search, menus]);

  // ==========================
  // Toggle Show All Menus
  // ==========================

const handleToggle = async (event) => {
  const checked = event.target.checked;

  try {
    await menuService.updateShowAllMenus({
      show_all_menus: checked,
    });

    setShowAllMenus(checked);

    // Reload the application so the sidebar refreshes
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, minWidth: 0 }}>
      {/* Header */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "1.25rem",
                  sm: "1.5rem",
                },
              }}
            >
              Menu Management
            </Typography>

            <TextField
              size="small"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 280,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Show All Menus Switch */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
          boxShadow: 2,
        }}
      >
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={showAllMenus}
                onChange={handleToggle}
              />
            }
            label="Show All Menus"
          />

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Enable this option to display all available menus for the Admin
            account. Disable it to show only the default admin menus.
          </Typography>
        </CardContent>
      </Card>

      {/* Menu List */}
      <MenuTable
        menus={filteredMenus}
        loading={loading}
      />
    </Box>
  );
}