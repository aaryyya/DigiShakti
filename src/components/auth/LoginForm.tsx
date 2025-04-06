import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Paper, 
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false, error = null }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors({
        ...formErrors,
        email: '',
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors({
        ...formErrors,
        password: '',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const errors = {
      email: '',
      password: '',
    };
    let isValid = true;

    // Email validation
    if (!email) {
      errors.email = t('common.required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('common.invalid_email');
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = t('common.required');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ email, password });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 450, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        {t('auth.login')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={t('auth.email')}
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handlePasswordChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
            {t('auth.forgot_password')}
          </Link>
        </Box>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.2 }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('auth.login')
          )}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            {t('auth.no_account')}{' '}
            <Link component={RouterLink} to="/auth/register" variant="body2">
              {t('auth.register')}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default LoginForm; 