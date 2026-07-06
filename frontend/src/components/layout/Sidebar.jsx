import { useEffect, useState } from "react";
import {
  Drawer,
  Toolbar,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Link, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import BusinessIcon from "@mui/icons-material/Business";
import FolderIcon from "@mui/icons-material/Folder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PaymentsIcon from "@mui/icons-material/Payments";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";

import menuService from "../../services/menuService";

const drawerWidth = 260;

const COLORS = {
  bg: "#161821",
  surfaceHover: "#1F2230",
  activeBg: "rgba(201, 166, 107, 0.12)",
  accent: "#C9A66B",
  textPrimary: "#EDEEF2",
  textMuted: "#8A8F9C",
  border: "rgba(255,255,255,0.06)",
};

const iconMap = {
  dashboard: <DashboardIcon />,
  users: <PeopleIcon />,
  people: <PeopleIcon />,
  security: <SecurityIcon />,
  lock: <LockIcon />,
  menu: <MenuIcon />,
  settings: <SettingsIcon />,
  business: <BusinessIcon />,
  folder: <FolderIcon />,
  calendar: <CalendarMonthIcon />,
  payments: <PaymentsIcon />,
  inventory: <InventoryIcon />,
  local_shipping: <LocalShippingIcon />,
  receipt: <ReceiptIcon />,
  assessment: <AssessmentIcon />,
};

export default function Sidebar({ mobileOpen, onClose }) {
  const [menus, setMenus] = useState([]);
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const response = await menuService.getMenus();
      setMenus(response.data.data);
    } catch (error) {
      console.error("Failed to load menus:", error);
    }
  };

  const drawerContent = (
    <>
      <Toolbar />

      <Box sx={{ px: 3, pt: 3, pb: 1.5 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: COLORS.textMuted,
            textTransform: "uppercase",
          }}
        >
          Navigation
        </Typography>
      </Box>

      <List sx={{ px: 1.5 }}>
        {menus.map((menu) => {
          const isActive = location.pathname === menu.route;

          return (
            <ListItemButton
              key={menu.id}
              component={Link}
              to={menu.route}
              onClick={isMobile ? onClose : undefined}
              selected={isActive}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: isActive ? COLORS.accent : COLORS.textPrimary,
                bgcolor: isActive ? COLORS.activeBg : "transparent",

                "&:hover": {
                  bgcolor: COLORS.surfaceHover,
                },

                "&.Mui-selected": {
                  bgcolor: COLORS.activeBg,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? COLORS.accent : COLORS.textMuted,
                }}
              >
                {iconMap[menu.icon] || <MenuIcon />}
              </ListItemIcon>

              <ListItemText
                primary={menu.menu_name}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: COLORS.bg,
          borderRight: `1px solid ${COLORS.border}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}