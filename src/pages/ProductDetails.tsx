import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Paper,
  CardMedia,
  Avatar
} from '@mui/material';
import { getProductById } from '../mocks/products';
import { Product } from '../types';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading with a timeout
    const timer = setTimeout(() => {
      try {
        if (productId) {
          const result = getProductById(productId);
          if (result) {
            setProduct(result);
          }
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setIsLoading(false);
      }
    }, 800); // Small delay to simulate loading

    return () => clearTimeout(timer);
  }, [productId]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          Product not found. Please check the URL or return to the marketplace.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button component={RouterLink} to="/marketplace" variant="contained">
            Go back to Marketplace
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Button 
          component={RouterLink} 
          to="/marketplace" 
          variant="text" 
          sx={{ mb: 2 }}
        >
          ← Back to Marketplace
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              alt={product.name}
              image={product.imageURL || "https://via.placeholder.com/600x400?text=Product+Image"}
              sx={{ 
                borderRadius: 2,
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover'
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Typography variant="h5" color="primary.main" gutterBottom>
                ₹{product.price.toLocaleString('en-IN')}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Category: <Chip label={product.category} size="small" sx={{ ml: 1 }} />
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            {product.tags && product.tags.length > 0 && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Tags:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Seller Information:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 2 }}>
                  {product.seller?.name.charAt(0) || 'S'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2">{product.seller?.name || 'Unknown Seller'}</Typography>
                </Box>
              </Box>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              sx={{ mt: 2 }}
            >
              Contact Seller
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails; 