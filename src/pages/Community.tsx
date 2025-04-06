import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Divider,
  CircularProgress 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getPosts } from '../services/communityService';
import { Post } from '../types';

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        // Simplify this call to avoid type issues
        const result = await getPosts();
        setPosts(result.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          component={RouterLink}
          to="/community/new"
          variant="contained"
          color="primary"
        >
          Create New Post
        </Button>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
          No posts available. Be the first to share something with the community!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="primary">
                    {post.category}
                  </Typography>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Posted by {post.authorName}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography 
                    variant="body1"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {post.content}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {post.comments?.length || 0} comments • {post.likes} likes
                    </Typography>
                    <Button 
                      component={RouterLink}
                      to={`/community/post/${post.id}`}
                      variant="outlined"
                      size="small"
                    >
                      Read More
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

export default Community; 