import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "#f4f6f9",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
        <Topbar onMenuClick={handleDrawerToggle} />

        {/* Page Content */}
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
              background: "#fff",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              minHeight: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}