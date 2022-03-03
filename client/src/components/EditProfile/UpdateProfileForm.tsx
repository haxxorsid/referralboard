import { Button, Box, TextField, MenuItem } from '@mui/material';
import React, { useEffect } from 'react';
import { experienceType, profileFormType, userType } from '../../types';
import {
    ValidatorForm,
    TextValidator
  } from 'react-material-ui-form-validator';
import { getExperiences, getUserProfile, updateUserProfile } from '../../common/apiService';

export default function UpdateProfileForm(props: any) {
    const initialFormValues = () => {
      return {
        firstName: "",
        lastName: "",
        currentLocation: "",
        currentCompanyName: "",
        currentPosition: "",
        school: "",
        yearsOfExperienceId: 1
      };
    };
  
    const [formValues, setFormValues] = React.useState<profileFormType>(initialFormValues());
    const [experiences, setExperiences] = React.useState<experienceType[]>([]);
    const [error, setError] = React.useState(null);

    const fillForm = (user: userType) => {
        setFormValues({
            firstName: user.firstName,
            lastName: user.lastName,
            currentLocation: user.currentLocation,
            currentCompanyName: user.currentCompanyName,
            currentPosition: user.currentPosition,
            school: user.school,
            yearsOfExperienceId: user.yearsOfExperienceId
        });
    }

    useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', (value: any) => value);
        getExperiences()
            .then((res) => {
                setExperiences(res);
            })
            .catch((error) => {
                setError(error);
            });
        getUserProfile()
            .then((res: userType) => {
                fillForm(res);
            })
            .catch((error: any) => {
                props.displayToast("error", error.message);
            });
    }, []);

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        updateUserProfile(formValues)
            .then((res: any) => {
                props.displayToast("success", "User profile updated");
            })
            .catch((error: any) => {
                props.displayToast("error", error.message);
            });
    };

    const handleChange =
        (prop: keyof profileFormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setSpecificFormValue(prop, event.target.value);
        };


    const setSpecificFormValue = (prop: keyof profileFormType, value: any) => {
            setFormValues({ ...formValues, [prop]: value });
        };

    return (
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
                    value={formValues.firstName}
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
                    value={formValues.lastName}
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
                    value={formValues.currentLocation}
                    onChange={handleChange("currentLocation")}
                />
                <TextValidator
                    margin="normal"
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    fullWidth
                    id="currentCompanyName"
                    value={formValues.currentCompanyName}
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
                    value={formValues.currentPosition}
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
                    value={formValues.school}
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
                    value={formValues.yearsOfExperienceId}
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
                <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                >
                    Save Changes
                </Button>
            </ValidatorForm>
        </Box>
    );
}