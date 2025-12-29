import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Container, Grid, Button } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import BoltIcon from "@mui/icons-material/Bolt";
import SpeedIcon from "@mui/icons-material/Speed";
import RefreshIcon from '@mui/icons-material/Refresh';

import StatCard from "./components/dashboard/StatCards";
import ActivityTimeline from "./components/dashboard/ActivityTimeline";

function App() {
  const [stats, setStats] = useState({ nodes: null, health: null, speed: null });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // REAL API CALL
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch("http://localhost:5000/api/dashboard/stats");
      const statsData = await statsRes.json();
      
      const eventsRes = await fetch("http://localhost:5000/api/dashboard/events");
      const eventsData = await eventsRes.json();

      setStats(statsData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Failed to fetch data from Omni-Server:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HubIcon sx={{ mr: 2, color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>OMNI-MAP</Typography>
          </Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDashboardData} size="small">
            Sync Real Data
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>Mission Control</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard title="Active Nodes" value={stats.nodes} icon={AccountTreeIcon} color="#7c4dff" loading={loading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="System Health" value={stats.health} icon={BoltIcon} color="#00e5ff" loading={loading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard title="Avg. Deployment" value={stats.speed} icon={SpeedIcon} color="#4caf50" loading={loading} />
          </Grid>
          <Grid item xs={12} md={8}>
             <Box sx={{ p: 4, height: '400px', borderRadius: 3, bgcolor: 'background.paper', border: '1px dashed rgba(124, 77, 255, 0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="textSecondary" variant="h6">Infrastructure Map</Typography>
                <Typography color="textSecondary" variant="body2">Waiting for connection...</Typography>
             </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <ActivityTimeline events={events} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
