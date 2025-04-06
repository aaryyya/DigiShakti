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
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import { getCourseById } from '../mocks/courses';
import { Course } from '../types';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading with a timeout
    const timer = setTimeout(() => {
      try {
        if (courseId) {
          const result = getCourseById(courseId);
          if (result) {
            setCourse(result);
          }
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setIsLoading(false);
      }
    }, 800); // Small delay to simulate loading

    return () => clearTimeout(timer);
  }, [courseId]);

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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">
          Course not found. Please check the URL or return to the courses page.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button component={RouterLink} to="/courses" variant="contained">
            Go back to Courses
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
          to="/courses" 
          variant="text" 
          sx={{ mb: 2 }}
        >
          ← Back to Courses
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Course Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {course.title}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={course.instructor.photoURL} alt={course.instructor.name} sx={{ mr: 2 }} />
                  <div>
                    <Typography variant="subtitle1">
                      Instructor: {course.instructor.name}
                    </Typography>
                  </div>
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
                    {course.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" color="primary.main" gutterBottom>
                      ₹{course.price.toLocaleString('en-IN')}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Duration: {formatDuration(course.duration)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BarChartIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                      <Typography variant="body2">
                        Level: <Chip 
                          label={course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                          size="small"
                          color={getLevelColor(course.level) as any}
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>
                    
                    {course.enrolledCount && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                        <Typography variant="body2">
                          {course.enrolledCount} students enrolled
                        </Typography>
                      </Box>
                    )}
                    
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      size="large"
                      sx={{ mt: 2 }}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Course Content */}
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Course Content
          </Typography>
          
          {course.modules && course.modules.length > 0 ? (
            <Box sx={{ mb: 4 }}>
              {course.modules.map((module, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                      Module {index + 1}: {module.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding>
                      {module.lessons.map((lesson, lessonIndex) => (
                        <ListItem 
                          key={lessonIndex}
                          divider={lessonIndex < module.lessons.length - 1}
                          sx={{ py: 1 }}
                        >
                          <ListItemText
                            primary={`${lessonIndex + 1}. ${lesson.title}`}
                            secondary={lesson.duration ? `Duration: ${lesson.duration} min` : null}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" sx={{ mb: 4 }}>
              No content available for this course.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetails; 