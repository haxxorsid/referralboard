import {theme} from '../../common/theme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, GlobalStyles, Container, Tabs, Tab} from '@mui/material';
import UpdateProfileForm from './UpdateProfileForm';
import UpdateEmailForm from './UpdateEmailForm';
import UpdatePasswordForm from './UpdatePasswordForm';
import NavBar from '../NavBar';
import React from 'react';
import Toast from '../common/Toast';

export default function EditProfile() {
  const [value, setValue] = React.useState(0);
  const [showToast, setShowToast] = React.useState(false);
  const [toastSeverity, setToastSeverity] = React.useState("success");
  const [toastMessage, setToastMessage] = React.useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const displayToast = (severity: string, message: string) => {
    setShowToast(true);
    setToastSeverity(severity);
    setToastMessage(message);
};

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
      <Container maxWidth="md" sx={{ alignItems: 'center' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="disabled tabs example" centered>
            <Tab label="Update Profile" />
            <Tab label="Update Email" />
            <Tab label="Update Password" />
        </Tabs>
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
        {value===0 && <UpdateProfileForm displayToast={displayToast}/>}
        {value===1 && <UpdateEmailForm displayToast={displayToast}/>}
        {value===2 && <UpdatePasswordForm displayToast={displayToast}/>}
        <Toast
          open={showToast}
          severity={toastSeverity}
          message={toastMessage}
          setOpen={setShowToast}
        />
      </Container>
      </ThemeProvider>
  );
}
