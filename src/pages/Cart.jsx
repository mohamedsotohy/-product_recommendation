import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const CART_STORAGE_KEY = "cartItems";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setCartItems(stored);
  }, []);

  const total = cartItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace("$", ""));
    return sum + price * item.quantity;
  }, 0);

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
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell align="right">{item.price}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              $
                              {parseInt(item.price.replace("$", "")) *
                                item.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 3, textAlign: "right" }}>
                    <Typography variant="h6">
                      Total: <strong>${total}</strong>
                    </Typography>
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
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Recommendations will populate here from the API.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
