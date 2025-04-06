import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { UserData } from '../../context/UserContext';

interface LayoutProps {
  isAuthenticated?: boolean;
  user?: UserData | null;
  isLoading?: boolean;
  onLogout?: () => void;
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  isAuthenticated = false, 
  user = null, 
  isLoading = false,
  onLogout, 
  children 
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} isLoading={isLoading} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children || <Outlet />}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 