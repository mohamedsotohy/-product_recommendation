import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1E88E5" },
    secondary: { main: "#616161" },
    background: { default: "#FAFAFA", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
});

export default theme;
