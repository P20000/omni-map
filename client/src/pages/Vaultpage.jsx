import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, TextField, Button, Grid, Chip, 
  Alert, Snackbar 
} from "@mui/material";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const VaultPage = ({ projectId }) => {
  const [keys, setKeys] = useState([]); // Stores list of what providers are connected
  const [formData, setFormData] = useState({ provider: "github", apiKey: "" });
  const [toast, setToast] = useState({ open: false, msg: "" });

  // 1. Fetch current status from Backend -> Turso --
  const fetchStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/vault/status?projectId=${projectId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setKeys(data);
      } else {
        setKeys([]);
      }
    } catch (err) {
      console.error("Vault status check failed");
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  // 2. Send real data to Backend -> Turso
  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vault/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, projectId })
      });
      
      if (res.ok) {
        setToast({ open: true, msg: "Credential Saved to Turso Successfully!" });
        setFormData({ ...formData, apiKey: "" }); // Clear input
        fetchStatus(); // Refresh the list
      }
    } catch (err) {
      setToast({ open: true, msg: "Error saving to database." });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", animation: "fadeIn 0.5s" }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>The Vault</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Securely store API keys. These are saved directly to your Turso database.
      </Typography>

      <Grid container spacing={4}>
        {/* Input Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant={formData.provider === 'github' ? "contained" : "outlined"}
                startIcon={<GitHubIcon />}
                onClick={() => setFormData({...formData, provider: 'github'})}
              >
                GitHub
              </Button>
              <Button 
                variant={formData.provider === 'aws' ? "contained" : "outlined"}
                startIcon={<CloudQueueIcon />}
                onClick={() => setFormData({...formData, provider: 'aws'})}
              >
                AWS
              </Button>
            </Box>

            <TextField 
              fullWidth 
              label={`${formData.provider.toUpperCase()} Access Token`}
              type="password"
              variant="outlined" 
              value={formData.apiKey}
              onChange={(e) => setFormData({...formData, apiKey: e.target.value})}
              sx={{ mb: 3 }}
            />

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              startIcon={<VpnKeyIcon />}
              onClick={handleSave}
              disabled={!formData.apiKey}
            >
              Encrypt & Save to DB
            </Button>
          </Paper>
        </Grid>

        {/* Status List */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Active Connections</Typography>
          {keys.length === 0 ? (
            <Alert severity="info">No credentials stored in Turso yet.</Alert>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {keys.map((k, i) => (
                <Paper key={i} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {k.provider === 'github' ? <GitHubIcon color="primary" /> : <CloudQueueIcon color="secondary" />}
                    <Typography sx={{ textTransform: 'capitalize', fontWeight: 500 }}>{k.provider}</Typography>
                  </Box>
                  <Chip icon={<CheckCircleIcon />} label="Active" color="success" size="small" variant="outlined" />
                </Paper>
              ))}
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({...toast, open: false})}
        message={toast.msg} 
      />
    </Box>
  );
};

export default VaultPage;