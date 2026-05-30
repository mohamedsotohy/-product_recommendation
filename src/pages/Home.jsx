import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getImageFromPexels } from "../services/pexelsService";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const CART_STORAGE_KEY = "cartItems";
const PRODUCTS_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/products/`
  : "http://localhost:8000/products/";

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [cartItems, setCartItems] = useState([]);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [productImages, setProductImages] = useState({});

  const normalizeProducts = (items) =>
    items.map((item, index) => {
      const id =
        item.product_key ??
        item.id ??
        item.product_source_id ??
        item.productSourceId ??
        item.product_name ??
        item.title ??
        `${index}`;
      const title =
        item.product_name ??
        item.title ??
        item.product_source_id ??
        `Product ${index + 1}`;

      return {
        ...item,
        id,
        title,
      };
    });

  const uniqueByTitle = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      const title = String(item.title || "")
        .trim()
        .toLowerCase();
      if (!title || seen.has(title)) return false;
      seen.add(title);
      return true;
    });
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get(`${PRODUCTS_ENDPOINT}?limit=100`);
        console.log("Products response:", response);
        const data = response.data;

        if (Array.isArray(data)) {
          setProducts(uniqueByTitle(normalizeProducts(data)));
        } else if (data?.products && Array.isArray(data.products)) {
          setProducts(uniqueByTitle(normalizeProducts(data.products)));
        } else {
          setProducts([]);
          setProductError(
            "Unexpected response format from backend. No products to display.",
          );
        }
      } catch (error) {
        console.error("Failed to load products from backend:", error);
        setProducts([]);
        setProductError(
          "Unable to fetch backend products. No products to display.",
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    const fetchImages = async () => {
      const images = {};
      for (const product of products) {
        if (product.img) continue;
        const imageUrl = await getImageFromPexels(product.title || "product");
        if (imageUrl) {
          images[product.id] = imageUrl;
        }
      }
      setProductImages(images);
    };

    fetchImages();
  }, [products]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    setCartItems(stored);
    setCart(new Set(stored.map((item) => item.id)));
  }, []);

  const saveCartItems = (items) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const productList = products;

  const addToCart = (e, id) => {
    e.stopPropagation();
    const product = productList.find((product) => product.id === id);
    if (!product) return;
    if (cart.has(id)) {
      setSnack({ open: true, message: "Already in cart", severity: "info" });
      return;
    }

    const productToAdd = { ...product, quantity: 1 };

    setCart((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    setCartItems((prev) => {
      const next = [...prev, productToAdd];
      saveCartItems(next);
      return next;
    });

    setSnack({ open: true, message: "Added to cart", severity: "success" });
  };

  const handleAddSelected = () => {
    const selectedProducts = productList
      .filter((product) => selected.has(product.id) && !cart.has(product.id))
      .map((product) => ({ ...product, quantity: 1 }));

    if (selectedProducts.length === 0) {
      setSnack({ open: true, message: "No items selected", severity: "info" });
      return;
    }

    setCart((prev) => {
      const next = new Set(prev);
      selectedProducts.forEach((product) => next.add(product.id));
      return next;
    });

    setCartItems((prev) => {
      const next = [...prev, ...selectedProducts];
      saveCartItems(next);
      return next;
    });

    setSelected(new Set());
    setSnack({
      open: true,
      message: "Selected items added to cart",
      severity: "success",
    });
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Home
          </Typography>
          <IconButton
            color="inherit"
            aria-label="cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSelected}
          >
            Add selected to cart
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>
          Featured Products
        </Typography>

        {productError && (
          <Typography color="error" sx={{ mb: 2 }}>
            {productError}
          </Typography>
        )}
        {loadingProducts && (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Loading products from backend...
          </Typography>
        )}

        <Grid container spacing={2}>
          {productList.map((p, index) => {
            const isSelected = selected.has(p.id);
            const inCart = cart.has(p.id);
            const keyProp =
              p.id ?? p.product_key ?? p.product_source_id ?? index;
            return (
              <Grid item key={keyProp} xs={12} sm={6} md={4}>
                <Card
                  onClick={() => toggleSelect(p.id)}
                  sx={(theme) => ({
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    border: isSelected
                      ? `2px solid ${theme.palette.primary.main}`
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: isSelected ? 6 : 1,
                    transition: "transform 0.12s, box-shadow 0.12s",
                    "&:hover": { transform: "translateY(-4px)" },
                  })}
                >
                  {(productImages[p.id] || p.img) && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={productImages[p.id] || p.img}
                      alt={p.title}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {p.title}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant={inCart ? "outlined" : "contained"}
                      color="primary"
                      fullWidth
                      onClick={(e) => addToCart(e, p.id)}
                    >
                      {inCart ? "Added" : "Add to cart"}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}
