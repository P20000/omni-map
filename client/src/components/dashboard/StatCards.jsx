import React from "react";
import { Paper, Box, Typography, Skeleton } from "@mui/material";

const StatCard = ({ title, value, icon: IconComponent, color, loading }) => {
  return (
    <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ 
        display: "flex", 
        p: 1.5, 
        borderRadius: 2, 
        bgcolor: `${color}20`, 
        color: color 
      }}>
        <IconComponent />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 0.5 }}>
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="text" width="60%" height={32} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
        ) : (
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {value || "--"}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
