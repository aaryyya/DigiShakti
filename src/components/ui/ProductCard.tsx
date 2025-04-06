import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Rating, 
  Chip,
  Button,
  CardActions,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTranslation } from 'react-i18next';

// Define product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
  };
  category: string;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  isFavorite = false,
  onAddToCart,
  onToggleFavorite
}) => {
  const { t } = useTranslation();
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };
  
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          sx={{ 
            height: 200,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          image={product.image}
          title={product.name}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
        
        {!product.inStock && (
          <Chip
            label={t('Out of Stock')}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
            }}
          />
        )}
        
        <Chip
          label={product.category}
          color="primary"
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('Sold by')}:
          </Typography>
          <Typography 
            variant="body2" 
            color="primary" 
            component={Link} 
            to={`/seller/${product.seller.id}`}
            sx={{ ml: 0.5, textDecoration: 'none' }}
          >
            {product.seller.name}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            value={product.rating} 
            precision={0.5} 
            size="small" 
            readOnly 
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({product.reviewCount})
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            height: '3em', 
            overflow: 'hidden', 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {product.description}
        </Typography>
        
        <Typography variant="h6" color="primary" fontWeight="bold">
          ₹{product.price.toLocaleString()}
        </Typography>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          {t('Add to Cart')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 