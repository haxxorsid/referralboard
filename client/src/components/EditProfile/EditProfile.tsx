import {theme} from '../../common/theme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, GlobalStyles, Container} from '@mui/material';
import EditProfileForm from './EditProfileForm';
import NavBar from '../NavBar';

export default function EditProfile() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      < NavBar />
      {/* Hero unit */}
      <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 4 }}>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Edit profile
        </Typography>
      </Container>
      <Container
        maxWidth="xs"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 1,
          py: [3, 6],
          alignItems: 'center', 
        }}
      >
        <EditProfileForm />
      </Container>
      </ThemeProvider>
  );
}