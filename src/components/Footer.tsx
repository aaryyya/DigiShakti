import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const footerLinks = [
    {
      title: 'DigiSakhi',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Mission', path: '/mission' },
        { name: 'Team', path: '/team' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press', path: '/press' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', path: '/blog' },
        { name: 'Success Stories', path: '/success-stories' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Us', path: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Community Guidelines', path: '/guidelines' },
      ],
    },
  ];

  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'background.paper',
        pt: 6,
        pb: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              DigiSakhi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Empowering women entrepreneurs through digital solutions, skills development, 
              and community support to build sustainable businesses.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton aria-label="facebook" color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="twitter" color="primary" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="instagram" color="primary" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="linkedin" color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
              <IconButton aria-label="youtube" color="primary" size="small">
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Footer links */}
          {footerLinks.map((section) => (
            <Grid item xs={12} sm={6} md={2.5} key={section.title}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ py: 0.5 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      underline="hover"
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Bottom footer */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} DigiSakhi. All rights reserved.
          </Typography>
          
          {isMobile ? (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Made with ❤️ for women entrepreneurs in India
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Made with ❤️ for women entrepreneurs in India
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 