import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const EditorPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>Omni-Editor</Typography>
      <Paper sx={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
        <Typography color="textSecondary">Canvas Initializing...</Typography>
      </Paper>
    </Box>
  );
};

export default EditorPage;
