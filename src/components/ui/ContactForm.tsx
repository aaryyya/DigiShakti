import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTranslation } from 'react-i18next';

interface ContactFormProps {
  title?: string;
  subtitle?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Contact Us',
  subtitle = 'Have questions or suggestions? Reach out to us!'
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const subjectOptions = [
    'General Inquiry',
    'Product Support',
    'Technical Issue',
    'Business Opportunity',
    'Feedback'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as { name: string; value: string };
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate subject
    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }
    
    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }, 1500);
    }
  };
  
  const handleCloseSnackbar = () => {
    setShowSuccess(false);
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {title}
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph align="center">
          {subtitle}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label={t('form.name')}
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label={t('form.email')}
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label={t('form.phone')}
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                type="tel"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!errors.subject} required>
                <InputLabel id="subject-label">{t('form.subject')}</InputLabel>
                <Select
                  labelId="subject-label"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label={t('form.subject')}
                >
                  {subjectOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
                {errors.subject && (
                  <Typography variant="caption" color="error">
                    {errors.subject}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="message"
                label={t('form.message')}
                fullWidth
                value={formData.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
                margin="normal"
                required
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                {isSubmitting ? t('form.sending') : t('form.send')}
              </Button>
            </Grid>
          </Grid>
        </Box>
        
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
            {t('form.success')}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default ContactForm; 