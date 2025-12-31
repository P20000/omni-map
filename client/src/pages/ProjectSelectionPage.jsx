import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card, 
  CardActionArea,
  Container,
  useTheme
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ProjectSelectionPage = ({ onSelectProject }) => {
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/architectures")
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to load projects", err));
  }, []);

  const handleCreate = async () => {
    if (!newProject.name) return;
    try {
      const res = await fetch("http://localhost:5000/api/architectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject)
      });
      if (res.ok) {
        const data = await res.json();
        setOpen(false);
        onSelectProject({ id: data.id, name: newProject.name });
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "background.default", 
      pt: 10,
      pb: 10
    }}>
      
      {/* 1. Header Section */}
      <Container maxWidth="xl" sx={{ textAlign: "center", mb: 10 }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 900, 
          letterSpacing: "-2px", 
          mb: 1,
          pb: 1, // Padding bottom ensures the text clip doesn't cut off descenders
          
          /* --- Complex 45° Wave Animation --- */
          
          // 1. The Pattern: A 45-degree angled flow
          // We alternate between the Primary color and a lighter variant (or white)
          // to create the "shimmer/wave" effect.
          background: `linear-gradient(
            45deg, 
            ${theme.palette.primary.main} 0%, 
            #ffffff 25%, 
            ${theme.palette.primary.main} 50%, 
            #ffffff 75%, 
            ${theme.palette.primary.main} 100%
          )`,
          
          // 2. Size: Large enough to slide smoothly
          backgroundSize: "400% 400%",
          
          // 3. Clipping to Text
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          
          // 4. The Animation
          // 'infinite' loops it
          // 'cubic-bezier' creates the realistic "surge" motion (slow start, fast middle, slow end)
          animation: "gradient-surge 6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
          
          // 5. Keyframes moving diagonally
          "@keyframes gradient-surge": {
            "0%": {
              backgroundPosition: "0% 50%",
            },
            "50%": {
              backgroundPosition: "100% 50%",
            },
            "100%": {
              backgroundPosition: "0% 50%",
            },
          },
        }}>
          OMNI-MAP
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, maxWidth: 600, mx: "auto", opacity: 0.8 }}>
          Orchestrate your infrastructure. Select a workspace to begin.
        </Typography>
      </Container>

      {/* 2. Main Grid - Switched to maxWidth="xl" for wider spread */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
        <Grid container spacing={4}>
          
          {/* Card 1: "Create New" - REDESIGNED */}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card 
              variant="outlined"
              sx={{ 
                height: 300, 
                // Lighter initial border
                border: "2px dashed rgba(255,255,255,0.08)", 
                bgcolor: "transparent",
                borderRadius: 4,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother easing
                // Engaging hover state
                "&:hover": { 
                  borderColor: "primary.main", 
                  bgcolor: `${theme.palette.primary.main}08`, // Very subtle primary glow fill
                  transform: "translateY(-6px)",
                  boxShadow: `0 12px 24px -12px ${theme.palette.primary.main}50`,
                  // Target the icon specifically on card hover
                  "& .create-icon": {
                    color: "primary.main",
                    transform: "scale(1.1) rotate(90deg)" // Rotate and grow
                  }
                }
              }}
            >
              <CardActionArea 
                onClick={() => setOpen(true)} 
                sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "center", 
                  alignItems: "center",
                  p: 4 // More internal padding
                }}
              >
                {/* Cleaner, larger icon without the heavy containing box */}
                <AddIcon 
                  className="create-icon" // Added class name for hover targeting
                  sx={{ 
                    fontSize: 80, // Much bigger
                    color: "rgba(255,255,255,0.15)", // Subtle initial color
                    mb: 4, // More breathing room below icon
                    transition: "all 0.3s ease"
                  }} 
                />
                
                <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  Create New
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, opacity: 0.7 }}>
                  Start fresh architecture
                </Typography>
              </CardActionArea>
            </Card>
          </Grid>
          {/* Card List: Existing Projects */}
          {projects.map((proj) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={proj.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: 300, 
                  bgcolor: "background.paper", 
                  borderRadius: 4, 
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "all 0.3s ease",
                  display: 'flex',
                  flexDirection: 'column',
                  "&:hover": { 
                    transform: "translateY(-6px)",
                    boxShadow: `0 12px 30px -5px ${theme.palette.primary.main}30`, 
                    borderColor: "primary.main"
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => onSelectProject(proj)} 
                  sx={{ 
                    flexGrow: 1, 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    justifyContent: 'space-between' 
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.dark', color: 'white' }}>
                        <AccountTreeIcon fontSize="medium" />
                      </Box>
                      <ArrowForwardIcon color="action" sx={{ opacity: 0.5 }} />
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {proj.name}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.6
                      }}
                    >
                      {proj.description || "No description provided."}
                    </Typography>
                  </Box>

                  <Box sx={{ width: '100%', pt: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
                      OPEN WORKSPACE &rarr;
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Creation Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.5rem' }}>
          New Architecture
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Give your new infrastructure environment a name.
          </Typography>
          <TextField
            autoFocus
            label="Project Name"
            placeholder="e.g. AWS Production V1"
            fullWidth
            variant="outlined"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Description"
            placeholder="Briefly describe this environment..."
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', mr: 1 }}>Cancel</Button>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleCreate} 
            disabled={!newProject.name}
            sx={{ px: 4, fontWeight: 700, borderRadius: 2 }}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectSelectionPage;