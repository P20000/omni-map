import React, { useState } from "react";
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  Drawer, 
  Typography, 
  Tabs, 
  Button, 
  Tab 
} from "@mui/material";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HubIcon from "@mui/icons-material/Hub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Pages
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import VaultPage from "./pages/VaultPage"; // Ensure file name matches casing
import ProjectSelectionPage from "./pages/ProjectSelectionPage";

const drawerWidth = 260;

function App() {
  // State to manage navigation and project scope
  const [currentProject, setCurrentProject] = useState(null); 
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // IF NO PROJECT SELECTED -> SHOW LOBBY
  if (!currentProject) {
    return (
      <>
        <CssBaseline />
        <ProjectSelectionPage onSelectProject={setCurrentProject} />
      </>
    );
  }

  // IF PROJECT SELECTED -> SHOW MAIN UI
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <CssBaseline />
      
      {/* Sidebar: Persistent Brand & Info */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: "border-box", 
            bgcolor: "background.paper", 
            borderRight: "1px solid rgba(255,255,255,0.05)" 
          },
        }}
      >
        <Toolbar sx={{ mt: 1 }}>
          <HubIcon sx={{ mr: 2, color: "primary.main" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "1px" }}>
            OMNI-MAP
          </Typography>
        </Toolbar>

        {/* Project Info Card in Sidebar */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ p: 2, bgcolor: 'rgba(124, 77, 255, 0.08)', borderRadius: 2, border: '1px solid rgba(124, 77, 255, 0.1)' }}>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
              Current Architecture
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {currentProject.name}
            </Typography>
            <Button 
              size="small" 
              startIcon={<ArrowBackIcon />} 
              sx={{ mt: 1, p: 0, textTransform: 'none', color: 'text.secondary' }}
              onClick={() => setCurrentProject(null)} // Go back to lobby
            >
              Switch Project
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation Tabs Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            textColor="primary"
            indicatorColor="primary"
            sx={{ px: 3, pt: 1 }}
          >
            <Tab label="Mission Control" icon={<DashboardIcon fontSize="small" />} iconPosition="start" sx={{ minHeight: 64, fontWeight: 600 }} />
            <Tab label="Omni-Editor" icon={<AccountTreeIcon fontSize="small" />} iconPosition="start" sx={{ minHeight: 64, fontWeight: 600 }} />
            <Tab label="The Vault" icon={<VpnKeyIcon fontSize="small" />} iconPosition="start" sx={{ minHeight: 64, fontWeight: 600 }} />
          </Tabs>
        </Box>

        {/* Tab Content Display */}
        <Box sx={{ p: 4, flexGrow: 1 }}>
            {activeTab === 0 && <Dashboard projectId={currentProject.id} />}
            {activeTab === 1 && <EditorPage projectId={currentProject.id} />}
            {activeTab === 2 && <VaultPage projectId={currentProject.id} />}
        </Box>

      </Box>
    </Box>
  );
}

export default App;