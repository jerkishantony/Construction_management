import { useState, useMemo, useEffect } from "react";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import settingsService from "../services/settingsService";

// Reads the logged-in user's id from what LoginPage already stores.
// Falls back to "guest" if nothing is found (e.g. not logged in yet).
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id ?? "guest";
  } catch {
    return "guest";
  }
};

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const userId = getUserId();
  const storageKey = `darkMode_${userId}`;

  // Seed synchronously from this user's own localStorage key
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored === null ? false : stored === "true";
  });

  // Only hit the backend if THIS user has never saved a local
  // preference on this browser before.
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored === null) {
      const seedFromBackend = async () => {
        try {
          const res = await settingsService.getSettings();
          const serverValue = !!res.data.dark_mode;
          setDarkMode(serverValue);
          localStorage.setItem(storageKey, String(serverValue));
        } catch (err) {
          console.error("Failed to load theme preference:", err);
        }
      };
      seedFromBackend();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Keep this user's key updated whenever they toggle it
  useEffect(() => {
    localStorage.setItem(storageKey, String(darkMode));
  }, [darkMode, storageKey]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDrawerClose = () => setMobileOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          background: (t) => t.palette.background.default,
          overflow: "hidden",
        }}
      >
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerClose} />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Topbar onMenuClick={handleDrawerToggle} />

          <Box
            sx={{
              flex: 1,
              mt: "64px",
              p: { xs: 2, md: 3 },
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                background: (t) => t.palette.background.paper,
                borderRadius: 3,
                p: { xs: 2, md: 3 },
                minHeight: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Outlet context={{ darkMode, setDarkMode }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}