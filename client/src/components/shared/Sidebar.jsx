import React from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Mission Control", icon: <DashboardIcon />, path: "/" },
    { text: "Omni-Editor", icon: <AccountTreeIcon />, path: "/editor" },
    { text: "Vault", icon: <VpnKeyIcon />, path: "/vault" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "background.paper", borderRight: "1px solid rgba(255,255,255,0.05)" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto", mt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  "&.Mui-selected": { bgcolor: "rgba(124, 77, 255, 0.15)", borderRight: "3px solid #7c4dff" },
                  mx: 1, borderRadius: 1, mb: 0.5
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? "primary.main" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
