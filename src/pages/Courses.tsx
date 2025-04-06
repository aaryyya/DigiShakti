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
import { getCoursesData } from '../mocks/courses';
import { Course } from '../types';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const result = getCoursesData();
        setCourses(result.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Skill Development Courses
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Enhance your skills with our curated courses designed specifically for women entrepreneurs. 
        Learn at your own pace and apply your knowledge to grow your business.
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', p: 4 }}>
          No courses available at the moment. Please check back later!
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                }
              }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={course.imageURL || "https://via.placeholder.com/300x180?text=Course"}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      size="small"
                      color={getLevelColor(course.level) as any}
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDuration(course.duration)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom>
                    {course.title}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description.length > 120 
                      ? `${course.description.substring(0, 120)}...` 
                      : course.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      Instructor:
                    </Typography>
                    <Typography variant="body2">
                      {course.instructor.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {course.rating && (
                      <>
                        <Rating value={course.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {course.rating.toFixed(1)}
                        </Typography>
                        {course.enrolledCount && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            ({course.enrolledCount} enrolled)
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                  
                  {course.tags && course.tags.length > 0 && (
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {course.tags.slice(0, 2).map((tag) => (
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
                    <Typography variant="h6" color="primary.main">
                      ₹{course.price.toLocaleString('en-IN')}
                    </Typography>
                    <Button 
                      component={RouterLink}
                      to={`/courses/${course.id}`}
                      variant="contained"
                      size="small"
                    >
                      View Course
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

export default Courses; 