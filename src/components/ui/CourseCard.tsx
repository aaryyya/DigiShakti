import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  Button,
  CardActions,
  LinearProgress,
  Stack,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import { useTranslation } from 'react-i18next';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
  };
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  rating: number;
  enrolledCount: number;
  lessonCount: number;
  progress?: number; // percentage of completion (0-100), optional
}

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { t } = useTranslation();
  
  // Format minutes into hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
      : `${mins}m`;
  };
  
  // Get the color for level chips
  const getLevelColor = (level: string): 'primary' | 'secondary' | 'success' => {
    switch(level) {
      case 'beginner':
        return 'primary';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'success';
      default:
        return 'primary';
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
          sx={{ height: 200 }}
          image={course.thumbnail}
          title={course.title}
        />
        <Chip
          label={t(course.level)}
          color={getLevelColor(course.level)}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            textTransform: 'capitalize',
          }}
        />
      </Box>
      
      {course.progress !== undefined && (
        <Box sx={{ px: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={course.progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              mt: -0.5, 
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
              }
            }} 
          />
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
          >
            {course.progress}% {t('completed')}
          </Typography>
        </Box>
      )}
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {course.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=random`} 
            alt={course.instructor.name}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography 
            variant="body2" 
            color="primary"
            component={Link}
            to={`/instructor/${course.instructor.id}`}
            sx={{ textDecoration: 'none' }}
          >
            {course.instructor.name}
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
            mb: 2 
          }}
        >
          {course.description}
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mb: 1,
            flexWrap: 'wrap',
            '& > div': {
              mb: 1
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {formatDuration(course.duration)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {course.lessonCount} {t('lessons')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {course.rating.toFixed(1)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {course.enrolledCount.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          component={Link}
          to={`/learning/course/${course.id}`}
        >
          {course.progress !== undefined 
            ? t('Continue Learning') 
            : t('Start Course')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard; 