import { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { oceanTheme, darkTheme } from "./theme";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

function App() {
  const [mode, setMode] = useState("ocean");

  const theme = useMemo(() => {
    return mode === "dark" ? darkTheme : oceanTheme;
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "dark" ? "ocean" : "dark"));
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Product Recommendation</Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={toggleTheme}
              aria-label="toggle theme"
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
