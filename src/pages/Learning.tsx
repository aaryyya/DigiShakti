import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getCourses } from '../services/courseService';
import { Course } from '../types';

// Simple redirect component that sends users to Courses component
const Learning: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        // Simplify to avoid document snapshot issues
        const result = await getCourses();
        setCourses(result.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
    
    // Redirect automatically to /courses after a delay
    const timer = setTimeout(() => {
      window.location.href = '/courses';
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Redirecting to Courses Page...
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="body1" paragraph>
            The Learning Center has been moved to our new Courses page.
          </Typography>
          <Button
            component={RouterLink}
            to="/courses"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Go to Courses Now
          </Button>
        </>
      )}
    </Container>
  );
};

export default Learning; 