import {theme} from '../../common/theme';
import { ThemeProvider } from '@mui/material/styles';
import ReferralCard from './Card';
import { CssBaseline, Typography, GlobalStyles, Container} from '@mui/material';
import NavBar from '../NavBar';

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      < NavBar />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Previous posts by You
        </Typography>
      </Container>
      <Container
        maxWidth="sm"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 1,
          py: [3, 6],
          alignItems: 'center', 
        }}
      >
        < ReferralCard self={true}/>
      </Container>
      </ThemeProvider>
  );
}