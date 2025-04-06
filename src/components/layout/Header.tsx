import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  useMediaQuery,
  useTheme,
  ListItemButton,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TranslateIcon from '@mui/icons-material/Translate';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { UserData } from '../../context/UserContext';

interface HeaderProps {
  isAuthenticated?: boolean;
  user?: UserData | null;
  isLoading?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isAuthenticated = false, 
  user = null, 
  isLoading = false,
  onLogout 
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null);
  const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget);
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenu(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageMenu(null);
  };

  const handleProfileClose = () => {
    setProfileMenu(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLanguageClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    handleProfileClose();
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navLinks = [
    { text: 'Home', path: '/', icon: <HomeIcon /> },
    { text: 'Marketplace', path: '/marketplace', icon: <ShoppingBagIcon /> },
    { text: 'Learning', path: '/learning', icon: <SchoolIcon /> },
    { text: 'Community', path: '/community', icon: <PeopleIcon /> },
  ];

  const drawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          DigiSakhi
        </Typography>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={t('header.dashboard')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/profile"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={t('header.profile')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={t('header.logout')} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/auth/login"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary={t('header.login')} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/auth/register"
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>
                  <HowToRegIcon />
                </ListItemIcon>
                <ListItemText primary={t('header.register')} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            DigiSakhi
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{ 
                    color: 'white', 
                    display: 'block', 
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleLanguageMenu}
              sx={{ color: 'white', mr: 1 }}
              aria-label="Change language"
              aria-controls={Boolean(languageMenu) ? 'language-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(languageMenu) ? 'true' : undefined}
            >
              <TranslateIcon />
            </IconButton>
            <Menu
              id="language-menu"
              anchorEl={languageMenu}
              open={Boolean(languageMenu)}
              onClose={handleLanguageClose}
              MenuListProps={{
                'aria-labelledby': 'language-button',
              }}
            >
              <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('hi')}>हिंदी (Hindi)</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('mr')}>मराठी (Marathi)</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('ta')}>தமிழ் (Tamil)</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('te')}>తెలుగు (Telugu)</MenuItem>
            </Menu>

            {!isMobile && (
              <>
                <Box>
                  {isAuthenticated ? (
                    <Button
                      component={Link}
                      to="/auth/login"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white', 
                        mr: 1,
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                      variant="outlined"
                    >
                      {user?.displayName || t('header.profile')}
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to="/auth/login"
                      color="secondary"
                      variant="contained"
                    >
                      {t('header.login')}
                    </Button>
                  )}
                </Box>
                <Button
                  component={Link}
                  to="/auth/register"
                  color="secondary"
                  variant="contained"
                >
                  {t('header.register')}
                </Button>
              </>
            )}
          </Box>

          {isMobile && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '300px',
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerList}
      </Drawer>
    </AppBar>
  );
};

export default Header; 