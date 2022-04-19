import AppBar from '@mui/material/AppBar';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { Button, Toolbar, Typography, Link} from '@mui/material';
import { useAuth } from '../common/auth';
import React from 'react';

export default function NavBar() {
  let auth = useAuth();
  let navigate = useNavigate();

  const logout = () => {
    auth.signout(() => {
      navigate("/login");
    }, (_error: any) => {
      navigate("/login");
    });
  };

  return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Referral Board
          </Typography>
          <nav>
          <Link component={RouterLink} to="/"
              variant="button"
              color="text.primary"
              sx={{ my: 1, mx: 1.5 }}
              underline="none"
            >
              Home
            </Link>
            <Link component={RouterLink} to="/edit-profile"
              variant="button"
              color="text.primary"
              sx={{ my: 1, mx: 1.5 }}
              underline="none"
            >
              Edit Profile
            </Link>
          </nav>
          <Button component={RouterLink} to="/create-post" variant="outlined" sx={{ my: 1, mx: 1.5 }} color="success">
          Post
          </Button>
          <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} color="error" onClick={logout}>
          Logout
          </Button>
        </Toolbar>
      </AppBar>
  );
}