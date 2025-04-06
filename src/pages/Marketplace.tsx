import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getProductsData } from '../mocks/products';
import { Product } from '../types';

const Marketplace: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = getProductsData();
        setProducts(result.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Marketplace
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Discover handcrafted products from women entrepreneurs across India. From traditional handicrafts to organic food products, 
        our marketplace connects you directly with talented artisans and businesswomen.
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
          No products available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageURL || "https://via.placeholder.com/400x200?text=Product+Image"}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="overline" 
                    color="primary"
                    sx={{ display: 'block', mb: 1 }}
                  >
                    {product.category}
                  </Typography>
                  
                  <Typography variant="h6" component="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2,
                      height: '40px'
                    }}
                  >
                    {product.description}
                  </Typography>
                  
                  {product.seller && (
                    <Typography variant="caption" display="block" sx={{ mb: 1 }}>
                      Seller: {product.seller.name}
                    </Typography>
                  )}
                  
                  {product.tags && product.tags.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {product.tags.slice(0, 3).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                    <Typography variant="h6" color="primary">
                      ₹{product.price.toLocaleString('en-IN')}
                    </Typography>
                    <Button 
                      component={Link}
                      to={`/marketplace/${product.id}`}
                      size="small"
                      variant="outlined"
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Marketplace; 