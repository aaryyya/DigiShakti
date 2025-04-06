import React from 'react';
import { Box, Container, Typography, Link, Divider, useTheme, useMediaQuery, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const footerLinks = [
    {
      title: t('footer.marketplace'),
      links: [
        { name: t('footer.browse_products'), url: '/marketplace' },
        { name: t('footer.sell_products'), url: '/marketplace/sell' },
        { name: t('footer.business_buyers'), url: '/marketplace/buyers' },
        { name: t('footer.success_stories'), url: '/community/success-stories' },
      ],
    },
    {
      title: t('footer.learning'),
      links: [
        { name: t('footer.courses'), url: '/learning' },
        { name: t('footer.tutorials'), url: '/learning/tutorials' },
        { name: t('footer.webinars'), url: '/learning/webinars' },
        { name: t('footer.resources'), url: '/learning/resources' },
      ],
    },
    {
      title: t('footer.community'),
      links: [
        { name: t('footer.forums'), url: '/community/forums' },
        { name: t('footer.events'), url: '/community/events' },
        { name: t('footer.mentorship'), url: '/community/mentorship' },
        { name: t('footer.partnerships'), url: '/community/partnerships' },
      ],
    },
    {
      title: t('footer.about'),
      links: [
        { name: t('footer.about_us'), url: '/about' },
        { name: t('footer.contact'), url: '/contact' },
        { name: t('footer.faqs'), url: '/faqs' },
        { name: t('footer.help_center'), url: '/help' },
      ],
    },
  ];

  return (
    <Box component="footer" sx={{ 
      backgroundColor: '#f5f5f5', 
      pt: 6, 
      pb: 3,
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item sx={{ width: { xs: '100%', sm: '50%', md: '25%' } }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'primary.main',
                textDecoration: 'none',
                display: 'inline-block',
                mb: 2,
              }}
            >
              DigiSakhi
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {t('footer.tagline')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
              <Link href="https://facebook.com" target="_blank" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="https://twitter.com" target="_blank" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="https://instagram.com" target="_blank" color="inherit">
                <InstagramIcon />
              </Link>
              <Link href="https://linkedin.com" target="_blank" color="inherit">
                <LinkedInIcon />
              </Link>
            </Box>
          </Grid>

          {!isMobile && footerLinks.map((section) => (
            <Grid item sx={{ width: { xs: '50%', sm: '25%', md: '16.66%' } }} key={section.title}>
              <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight="bold">
                {section.title}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {section.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ py: 0.5 }}>
                    <Link
                      component={RouterLink}
                      to={link.url}
                      color="text.secondary"
                      sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}

          {isMobile && (
            <Grid item sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                {footerLinks.map((section) => (
                  <Grid item sx={{ width: '50%' }} key={section.title}>
                    <Typography variant="subtitle1" color="text.primary" gutterBottom fontWeight="bold">
                      {section.title}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                      {section.links.slice(0, 2).map((link) => (
                        <Box component="li" key={link.name} sx={{ py: 0.5 }}>
                          <Link
                            component={RouterLink}
                            to={link.url}
                            color="text.secondary"
                            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                          >
                            {link.name}
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} DigiSakhi. {t('footer.rights')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: isMobile ? 2 : 0 }}>
            <Link component={RouterLink} to="/privacy" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              {t('footer.privacy')}
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              {t('footer.terms')}
            </Link>
            <Link component={RouterLink} to="/accessibility" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              {t('footer.accessibility')}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 