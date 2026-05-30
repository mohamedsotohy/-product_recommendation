import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
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
  shape: {
    borderRadius: 8,
  },
});

export const oceanTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0277BD" },
    secondary: { main: "#00ACC1" },
    background: { default: "#E1F5FE", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90CAF9" },
    secondary: { main: "#CE93D8" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#FFFFFF", secondary: "#B0BEC5" },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
});

export default darkTheme;
