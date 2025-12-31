import React, { useState, useEffect } from "react";
// Stable imports
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  useTheme, 
  Paper,
  Chip // Added Chip for the status badge
} from "@mui/material";

// Icons
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import RefreshIcon from "@mui/icons-material/Refresh";
import LayersIcon from '@mui/icons-material/Layers';
import WifiOffIcon from '@mui/icons-material/WifiOff'; // Icon for offline state

// Components
import StatCard from "../components/dashboard/StatCards";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

function Dashboard() {
  const theme = useTheme();
  
  // State
  const [stats, setStats] = useState({ nodes: null, health: null, speed: null });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true); // Track connection status

  const fetchDashboardData = async () => {
    setLoading(true);
    setServerOnline(true); // Assume online first
    
    try {
      // We use a timeout signal so the app doesn't hang if server is down
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

      const [statsRes, eventsRes] = await Promise.all([
        fetch("http://localhost:5000/api/dashboard/stats", { signal: controller.signal }),
        fetch("http://localhost:5000/api/dashboard/events", { signal: controller.signal })
      ]);
      
      clearTimeout(timeoutId);

      if (!statsRes.ok || !eventsRes.ok) throw new Error("API Error");

      const statsData = await statsRes.json();
      const eventsData = await eventsRes.json();

      setStats(statsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Sync Failed:", error);
      setServerOnline(false); // Trigger the "Offline" UI
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <Box sx={{ animation: "fadeIn 0.5s ease-in" }}>
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
              Mission Control
            </Typography>
            {!serverOnline && (
              <Chip 
                icon={<WifiOffIcon />} 
                label="Backend Offline" 
                color="error" 
                variant="outlined" 
                size="small" 
              />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Live system orchestration overview.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          disableElevation
          startIcon={<RefreshIcon />} 
          onClick={fetchDashboardData}
          color={serverOnline ? "primary" : "error"}
          sx={{ borderRadius: 2, fontWeight: "bold", textTransform: "none" }}
        >
          {serverOnline ? "Sync System" : "Retry Connection"}
        </Button>
      </Box>
      
      {/* Metrics Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard title="Active Nodes" value={stats.nodes} icon={AccountTreeIcon} color={theme.palette.primary.main} loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="System Health" value={stats.health} icon={BoltIcon} color={theme.palette.secondary.main} loading={loading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Deployment Speed" value={stats.speed} icon={SpeedIcon} color="#4caf50" loading={loading} />
        </Grid>
      </Grid>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
           <Paper sx={{ 
             p: 4, 
             height: "460px", 
             borderRadius: 4, 
             display: "flex", 
             flexDirection: "column", 
             alignItems: "center", 
             justifyContent: "center", 
             border: "1px dashed rgba(124, 77, 255, 0.3)", 
             bgcolor: "rgba(124, 77, 255, 0.02)" 
           }}>
              <LayersIcon sx={{ fontSize: 60, color: "rgba(255,255,255,0.1)", mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Infrastructure Map</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                Use the <b>Omni-Editor</b> tab to design your workflow.
              </Typography>
           </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <ActivityTimeline events={events} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;