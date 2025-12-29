import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7c4dff", // Deep Purple
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#00e5ff", // Cyan for health/status
    },
    background: {
      default: "#0a0910", // Dark Space
      paper: "#161320",   // Card depth
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#161320",
          border: "1px solid rgba(124, 77, 255, 0.1)",
        },
      },
    },
  },
});

export default theme;
