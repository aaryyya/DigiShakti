import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getCurrentUserData } from '../services/authService';
import { getUserPosts } from '../services/communityService';
import { getSellerProducts } from '../services/productService';
import { Product, Post } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const userData = await getCurrentUserData();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && tabValue === 1) {
      fetchUserPosts();
    } else if (user && tabValue === 2) {
      fetchUserProducts();
    }
  }, [tabValue, user]);

  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      setLoadingPosts(true);
      const posts = await getUserPosts(user.uid);
      setUserPosts(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUserProducts = async () => {
    if (!user) return;
    
    try {
      setLoadingProducts(true);
      const products = await getSellerProducts(user.uid);
      setUserProducts(products);
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h5" align="center">
          Please log in to view your profile
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={2}>
            <Avatar
              src={user.photoURL}
              alt={user.displayName}
              sx={{ width: 120, height: 120, margin: '0 auto' }}
            />
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" gutterBottom>
              {user.displayName}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {user.email}
            </Typography>
            
            {user.bio && (
              <Typography variant="body1" paragraph>
                {user.bio}
              </Typography>
            )}
            
            {user.location && (
              <Typography variant="body2" color="text.secondary">
                Location: {user.location}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              fullWidth
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Profile Information" />
            <Tab label="My Posts" />
            <Tab label="My Products" />
            <Tab label="My Courses" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Full Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.displayName}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.email}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.phone || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Location:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.location || 'Not provided'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Business Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Business Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.businessName || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Business Type:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">{user.businessType || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Joined:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Not available'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {loadingPosts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userPosts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
              You haven't created any posts yet.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {userPosts.map((post) => (
                <Grid item xs={12} key={post.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="overline" color="primary">
                        {post.category}
                      </Typography>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {post.title}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" paragraph>
                        {post.content.substring(0, 200)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {post.comments?.length || 0} comments • {post.likes} likes
                        </Typography>
                        <Button variant="outlined" size="small">
                          View Full Post
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {loadingProducts ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : userProducts.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
              You haven't listed any products yet.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {userProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card>
                    {product.imageURL && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.imageURL}
                        alt={product.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {product.description.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary">
                          ₹{product.price}
                        </Typography>
                        <Chip label={product.category} size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button variant="contained" size="small">
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
            You haven't enrolled in any courses yet.
          </Typography>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Profile; 