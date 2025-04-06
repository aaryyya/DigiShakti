import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Divider,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HeroImage from '../assets/images/hero-image.jpg';
// Replace Firebase services with our mock data sources
import { mockProducts, getProductsData } from '../mocks/products';
import { mockCourses, getCoursesData } from '../mocks/courses';
import { getPosts } from '../services/communityService';
import { Product, Course, Post } from '../types';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading with timeout
        setTimeout(() => {
          // Get featured products (first 4 from mock data)
          setFeaturedProducts(mockProducts.slice(0, 4));
          
          // Get featured courses (first 4 from mock data)
          setFeaturedCourses(mockCourses.slice(0, 4));
          
          // We'll keep this as-is for now
          getPosts(null, 3).then(({ posts }) => {
            setCommunityPosts(posts);
          }).catch(err => {
            console.error("Error fetching community posts:", err);
            setCommunityPosts([]);
          });
          
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        // Use empty arrays as fallback
        setFeaturedProducts([]);
        setFeaturedCourses([]);
        setCommunityPosts([]);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: isMobile ? '50vh' : '70vh',
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ color: 'white', maxWidth: isTablet ? '100%' : '60%' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Empowering Rural Women Entrepreneurs
            </Typography>
            <Typography variant="h5" paragraph>
              Connect, Learn, and Grow Your Business with DigiSakhi
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={RouterLink}
                to="/marketplace"
                sx={{ px: 4, py: 1.5 }}
              >
                Explore Marketplace
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large"
                component={RouterLink}
                to="/courses"
                sx={{ px: 4, py: 1.5 }}
              >
                Browse Courses
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      {/* Featured Products Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Featured Products
            </Typography>
            <Button 
              component={RouterLink} 
              to="/marketplace"
              variant="text" 
              color="primary"
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {!isLoading && featuredProducts.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No products available at the moment.
                </Typography>
              </Box>
            )}
            
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
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
                        mb: 2
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ₹{product.price.toLocaleString('en-IN')}
                      </Typography>
                      <Button 
                        component={RouterLink}
                        to={`/products/${product.id}`}
                        size="small"
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Courses Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Featured Courses
            </Typography>
            <Button 
              component={RouterLink} 
              to="/courses"
              variant="text" 
              color="primary"
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {!isLoading && featuredCourses.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No courses available at the moment.
                </Typography>
              </Box>
            )}
            
            {featuredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={3} key={course.id}>
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
                    image={course.imageURL || "https://via.placeholder.com/400x200?text=Course+Image"}
                    alt={course.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                        size="small"
                        color={
                          course.level === 'beginner' ? 'success' : 
                          course.level === 'intermediate' ? 'primary' : 
                          'error'
                        }
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="h6" component="h3" gutterBottom>
                      {course.title}
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
                        mb: 2
                      }}
                    >
                      {course.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        ₹{course.price.toLocaleString('en-IN')}
                      </Typography>
                      <Button 
                        component={RouterLink}
                        to={`/courses/${course.id}`}
                        size="small"
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Community Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Community Updates
            </Typography>
            <Button 
              component={RouterLink} 
              to="/community"
              variant="text" 
              color="primary"
            >
              Join Community
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {!isLoading && communityPosts.length === 0 && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  No community posts available at the moment.
                </Typography>
                <Button 
                  component={RouterLink} 
                  to="/community"
                  variant="contained" 
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Create First Post
                </Button>
              </Box>
            )}
            
            {communityPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.content}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Posted by {post.authorName} • {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
                      </Typography>
                      <Button 
                        component={RouterLink} 
                        to={`/community/post/${post.id}`}
                        size="small"
                      >
                        View Discussion
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {communityPosts.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                component={RouterLink} 
                to="/community"
                variant="outlined" 
                color="primary"
              >
                View All Posts
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      
      {/* Why Choose Us Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Why Choose DigiSakhi
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
            DigiSakhi helps rural women entrepreneurs overcome barriers to success by providing digital solutions tailored to their needs.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Digital Marketplace
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sell your products directly to customers across India without intermediaries. Create your online store and reach a wider market.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Skill Development
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access courses on business management, digital marketing, financial literacy, and more. Learn at your own pace.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Community Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with other women entrepreneurs, share experiences, ask questions, and build your network.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 