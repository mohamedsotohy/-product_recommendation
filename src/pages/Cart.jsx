import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const CART_STORAGE_KEY = "cartItems";
const RECOMMENDATIONS_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/recommendations/`
  : "http://localhost:8000/recommendations/";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [submitStatus, setSubmitStatus] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setCartItems(stored);

    if (stored.length > 0) {
      fetchRecommendations(stored);
    }
  }, []);

  const fetchRecommendations = async (items) => {
    try {
      setRecommendationsLoading(true);
      setSubmitStatus("Fetching recommendations...");
      const payload = {
        cart_products: items.map((item) =>
          String(
            item.title ??
              item.product_name ??
              item.product_source_id ??
              item.id,
          ),
        ),
        top_k: 5,
      };
      console.log("Recommendation request payload:", payload);

      const response = await axios.post(RECOMMENDATIONS_ENDPOINT, payload);
      console.log("Recommendations response:", response);
      setRecommendations(response.data.recommendations || []);
      setSubmitStatus("Recommendations loaded.");
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendationsError("Unable to load recommendations right now.");
      setSubmitStatus(`Failed to fetch recommendations: ${error.message}`);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Shopping Cart
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, minHeight: 420 }}>
              <Typography variant="h5" gutterBottom>
                Your Cart
              </Typography>
              {submitStatus && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {submitStatus}
                </Typography>
              )}
              {cartItems.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Your cart is empty
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id ?? item.title}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      onClick={() => {
                        localStorage.removeItem(CART_STORAGE_KEY);
                        setCartItems([]);
                        alert("Checkout completed — cart cleared.");
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, minHeight: 420 }}>
              <Typography variant="h5" gutterBottom>
                Recommended for you
              </Typography>
              {recommendationsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : recommendationsError ? (
                <Typography color="error" sx={{ mt: 1 }}>
                  {recommendationsError}
                </Typography>
              ) : recommendations.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  No recommendations available for this cart yet.
                </Typography>
              ) : (
                <List>
                  {recommendations.map((rec, index) => (
                    <ListItem key={`${rec.recommended_item}-${index}`}>
                      <ListItemText
                        primary={rec.recommended_item}
                        secondary={`Score: ${rec.score.toFixed(2)}, Confidence: ${rec.confidence.toFixed(2)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
