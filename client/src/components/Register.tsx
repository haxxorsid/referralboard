import * as React from "react";
import {
  Avatar,
  Button,
  TextField,
  CssBaseline,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { theme } from "../common/theme";
import { getExperiences, registerUser } from "../common/apiService";
import { useEffect, useState } from "react";
import { userType, experienceType } from "../types";
import Toast from "./common/Toast";
import {
  ValidatorForm,
  TextValidator
} from 'react-material-ui-form-validator';

export default function Register() {
  const initialFormValues = () => {
    return {
      firstName: "",
      lastName: "",
      currentLocation: "",
      currentCompanyName: "",
      currentPosition: "",
      school: "",
      yearsOfExperienceId: 1,
      email: "",
      password: "",
    };
  };

  const [user, setUser] = React.useState<userType>(initialFormValues());
  const [showToast, setShowToast] = React.useState(false);
  const [toastSeverity, setToastSeverity] = React.useState("success");
  const [toastMessage, setToastMessage] = React.useState("");

  const [experiences, setExperiences] = useState<experienceType[]>([]);
  const [error, setError] = useState(null);

  // get cards, set cards if success, otherwise set error
  useEffect(() => {
    ValidatorForm.addValidationRule('isTruthy', (value: any) => value);
    getExperiences()
      .then((res) => {
        setExperiences(res);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    registerUser(user)
      .then((res) => {
        displayToast("success", "User registered");
        setUser(initialFormValues());
      })
      .catch((error) => {
        displayToast("error", error.message);
      });
  };

  const handleChange =
    (prop: keyof userType) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setUser({ ...user, [prop]: event.target.value });
    };

  const displayToast = (severity: string, message: string) => {
    setShowToast(true);
    setToastSeverity(severity);
    setToastMessage(message);
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
          <Typography component='h1' variant='h5'>
            Register
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
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="firstName"
                value={user.firstName}
                label="First Name"
                name="firstName"
                autoComplete="firstName"
                autoFocus
                onChange={handleChange("firstName")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="lastName"
                value={user.lastName}
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                onChange={handleChange("lastName")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="currentLocation"
                label="Current Location"
                name="currentLocation"
                autoComplete="currentLocation"
                value={user.currentLocation}
                onChange={handleChange("currentLocation")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="currentCompanyName"
                value={user.currentCompanyName}
                label="Current Company Name"
                name="currentCompanyName"
                autoComplete="currentCompanyName"
                onChange={handleChange("currentCompanyName")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="currentPosition"
                value={user.currentPosition}
                label="Current Position Title"
                name="currentPosition"
                autoComplete="currentPosition"

                onChange={handleChange("currentPosition")}
              />
              <TextValidator
                margin="normal"
                validators={["required"]}
                errorMessages={["this field is required"]}
                fullWidth
                id="school"
                value={user.school}
                label="School"
                name="school"
                autoComplete="school"
                onChange={handleChange("school")}
              />
              <TextField
                margin="normal"
                id="yearsOfExperienceId"
                select
                fullWidth
                label="Years of Experience"
                value={user.yearsOfExperienceId}
                onChange={handleChange("yearsOfExperienceId")}
                required
              >
                {experiences &&
                  experiences.map((experience) => (
                    <MenuItem
                      value={experience.yearsOfExperienceId}
                      key={experience.yearsOfExperienceId}
                    >
                      {experience.description}
                    </MenuItem>
                  ))}
              </TextField>
              <TextValidator
                margin="normal"
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "Not a valid Email address"]}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={user.email}
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
                value={user.password}
                autoComplete="current-password"
                onChange={handleChange("password")}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to='/login' variant='body2'>
                    Back to login?
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
