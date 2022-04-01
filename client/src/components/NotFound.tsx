import {
  CssBaseline,
  Box,
  Container,
  Avatar,
  Typography,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../common/theme';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

export default function NotFound() {
    
  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#333' }}>
            <QuestionMarkIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            404 - No such page exists.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
