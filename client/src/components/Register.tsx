import * as React from 'react';
import {Avatar, Button, TextField, CssBaseline, Link, Grid, Box, Typography, Container, SelectChangeEvent, MenuItem, Select, InputLabel, FormControl} from '@mui/material';
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { ThemeProvider } from '@mui/material/styles';
import {Link as RouterLink} from 'react-router-dom';
import {theme} from '../common/theme';

export default function Register() {
  const [yoe, setYoe] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      email: data.get('email'),
    });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setYoe(event.target.value as string);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AppRegistrationIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstname"
              label="First Name"
              name="firstname"
              autoComplete="firstname"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              autoComplete="lastname"
            />
            <TextField
            margin="normal"
            required
            fullWidth
            id="location"
            label="Current Location"
            name="location"
            autoComplete="location"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="company"
              label="Current Company Name"
              name="company"
              autoComplete="company"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="position"
              label="Current Position Title"
              name="position"
              autoComplete="position"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="school"
              label="School"
              name="school"
              autoComplete="school"
            />
            <FormControl fullWidth sx={{my: [2, 2]}}>
              <InputLabel id="yoe-label">Years of Experience</InputLabel>
              <Select
              labelId="yoe-label"
              required
              id="yoe"
              value={yoe}
              label="Years of Experience"
              onChange={handleChange}
              >
                <MenuItem value={1}>0 Years / Student / Intern</MenuItem>
                <MenuItem value={2}>0 - 1 Years</MenuItem>
                <MenuItem value={3}>1 - 3 Years</MenuItem>
                <MenuItem value={4}>3 - 5 Years</MenuItem>
                <MenuItem value={5}>5 - 7 Years</MenuItem>
                <MenuItem value={6}>7 - 10 Years</MenuItem>
                <MenuItem value={7}>10+ Years</MenuItem>
                </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="/login" variant="body2">
                  Back to login?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot Password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}