import * as React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { theme } from '../common/theme';
import {
  ValidatorForm,
  TextValidator
} from 'react-material-ui-form-validator';
import { loginType } from "../types";
import Toast from './common/Toast';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../common/auth';

export default function Login() {
  const initialFormValues = () => {
    return {
      email: "",
      password: "",
    };
  };

  const [loginValues, setLoginValues] = React.useState<loginType>(initialFormValues());
  const [showToast, setShowToast] = React.useState(false);
  const [toastSeverity, setToastSeverity] = React.useState("success");
  const [toastMessage, setToastMessage] = React.useState("");
  let auth = useAuth();
  let navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    auth.signin(loginValues, () => {
      navigate("/", { replace: true });
    }, (error: any) => {
      displayToast("error", error.message);
    });
  };

  const handleChange =
    (prop: keyof loginType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoginValues({ ...loginValues, [prop]: event.target.value });
    };

  const displayToast = (severity: string, message: string) => {
    setShowToast(true);
    setToastSeverity(severity);
    setToastMessage(message);
  };

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <Box
            sx={{ mt: 1, width: '100%' }}
          >
            <ValidatorForm
              onSubmit={handleSubmit}
              onError={(errors: any) => console.log(errors)}
            >
              <TextValidator
                margin="normal"
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "Not a valid Email address"]}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={loginValues.email}
                onChange={handleChange("email")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={loginValues.password}
                autoComplete="current-password"
                onChange={handleChange("password")}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link component={RouterLink} to='/register' variant='body2'>
                    Register?
                  </Link>
                </Grid>
              </Grid>
            </ValidatorForm>
          </Box>
        </Box>
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
