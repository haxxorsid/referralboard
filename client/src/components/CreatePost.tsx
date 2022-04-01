import { theme } from '../common/theme';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Typography, GlobalStyles, Container, Box, Button, TextField, MenuItem } from '@mui/material';
import NavBar from './NavBar';
import React, { useEffect } from 'react';
import Toast from './common/Toast';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { createPost, getCompanies } from '../common/apiService';
import { createPostFormType, companyType } from '../types';
import { isUrlText } from '../common/customValidationRules';

export default function CreatePost() {

    const initialFormValues = () => {
        return {
            targetCompanyId: 1,
            targetPosition: "",
            message: "",
            resume: "",
            jobLink: ""
        };
    };

    const [formValues, setFormValues] = React.useState<createPostFormType>(initialFormValues());
    const [companies, setCompanies] = React.useState<companyType[]>([]);
    const [error, setError] = React.useState(null);
    const [showToast, setShowToast] = React.useState(false);
    const [toastSeverity, setToastSeverity] = React.useState("success");
    const [toastMessage, setToastMessage] = React.useState("");

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        createPost(formValues)
            .then((res: any) => {
                displayToast("success", "Post created");
                setFormValues(initialFormValues());
            })
            .catch((error: any) => {
                displayToast("error", error.message);
            });
    };

    const displayToast = (severity: string, message: string) => {
        setShowToast(true);
        setToastSeverity(severity);
        setToastMessage(message);
    };

    useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', (value: any) => value);
        ValidatorForm.addValidationRule('isUrl', value => {
            return isUrlText(value)
          })
        getCompanies()
            .then((res: React.SetStateAction<companyType[]>) => {
                setCompanies(res);
            })
            .catch((error: React.SetStateAction<null>) => {
                setError(error);
            });
    }, []);

    const handleChange =
        (prop: keyof createPostFormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues({ ...formValues, [prop]: event.target.value });
        };

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            < NavBar />
            {/* Hero unit */}
            <Container disableGutters maxWidth="md" component="main" sx={{ pt: 8, pb: 4 }}>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    Create Post
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
                            id="targetPosition"
                            value={formValues.targetPosition}
                            label="Target Position"
                            name="targetPosition"
                            onChange={handleChange("targetPosition")}
                        />
                        <TextValidator
                            margin="normal"
                            validators={["required", "maxStringLength: 300"]}
                            errorMessages={["this field is required", "Message should be maximum 300 chars long"]}
                            fullWidth
                            id="message"
                            label="Message"
                            name="message"
                            value={formValues.message}
                            multiline
                            rows={5}
                            onChange={handleChange("message")}
                        />
                        <TextValidator
                            margin="normal"
                            validators={["required", "isUrl"]}
                            errorMessages={["this field is required", "Resume link must be a url and begins with http/https"]}
                            fullWidth
                            id="resume"
                            value={formValues.resume}
                            label="Resume Link"
                            name="resume"
                            autoComplete="resume"
                            onChange={handleChange("resume")}
                        />
                        <TextValidator
                            margin="normal"
                            validators={["required", "isUrl"]}
                            errorMessages={["this field is required", "Job link must be a url and begins with http/https"]}
                            fullWidth
                            id="jobLink"
                            value={formValues.jobLink}
                            label="Job Link"
                            name="jobLink"
                            onChange={handleChange("jobLink")}
                        />
                        <TextField
                            margin="normal"
                            id="targetCompanyId"
                            select
                            fullWidth
                            label="Target Company"
                            value={formValues.targetCompanyId}
                            onChange={handleChange("targetCompanyId")}
                        >
                            {companies &&
                                companies.map((company) => (
                                    <MenuItem
                                        value={company.companyId}
                                        key={company.companyId}
                                    >
                                        {company.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Post
                        </Button>
                    </ValidatorForm>
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
