import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setFormData({
      ...formData,
      inquiryType: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Here you would typically send the form data to your backend or email service
    console.log('Form submitted:', formData);
    
    // Show success message and reset form
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: ''
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Contact Us
      </Typography>
      
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Have questions about DigiSakhi? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="inquiry-type-label">Inquiry Type</InputLabel>
                <Select
                  labelId="inquiry-type-label"
                  value={formData.inquiryType}
                  onChange={handleSelectChange}
                  label="Inquiry Type"
                >
                  <MenuItem value="general">General Question</MenuItem>
                  <MenuItem value="product">Product Related</MenuItem>
                  <MenuItem value="course">Course Related</MenuItem>
                  <MenuItem value="technical">Technical Support</MenuItem>
                  <MenuItem value="business">Business Inquiry</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Your Message"
                name="message"
                multiline
                rows={6}
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large"
                fullWidth
              >
                Send Message
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Other Ways to Reach Us
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Email
              </Typography>
              <Typography variant="body2">
                support@digisakhi.com
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Phone
              </Typography>
              <Typography variant="body2">
                +91 9876543210
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Address
              </Typography>
              <Typography variant="body2">
                123 Innovation Street, Tech Park<br />
                Bangalore, Karnataka 560001<br />
                India
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar open={submitted} autoHideDuration={5000} onClose={() => setSubmitted(false)}>
        <Alert severity="success">
          Thank you for your message! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={5000} onClose={handleCloseError}>
        <Alert severity="error" onClose={handleCloseError}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 