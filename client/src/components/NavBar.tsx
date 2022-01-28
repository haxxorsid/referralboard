import AppBar from '@mui/material/AppBar';
import {Link as RouterLink} from 'react-router-dom';
import { Button, Toolbar, Typography, Link} from '@mui/material';

export default function NavBar() {
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
          <Button component={RouterLink} to="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }} color="error">
          Logout
          </Button>
        </Toolbar>
      </AppBar>
  );
}