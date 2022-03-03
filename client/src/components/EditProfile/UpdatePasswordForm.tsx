import { Button, Box } from '@mui/material';
import React from 'react';
import { passwordFormType } from '../../types';
import {
    ValidatorForm,
    TextValidator
} from 'react-material-ui-form-validator';
import { updateUserPassword } from '../../common/apiService';

export default function UpdatePasswordForm(props: any) {
    const initialFormValues = () => {
        return {
            currentPassword: "",
            newPassword: ""
        };
    };

    const [formValues, setFormValues] = React.useState<passwordFormType>(initialFormValues());
    const [error, setError] = React.useState(null);

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        updateUserPassword(formValues)
            .then((res: any) => {
                props.displayToast("success", "User password updated");
            })
            .catch((error: any) => {
                props.displayToast("error", error.message);
            });
    };

    const handleChange =
        (prop: keyof passwordFormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues({ ...formValues, [prop]: event.target.value });
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
              name="current-password"
              label="Enter Current Password"
              type="password"
              id="password"
              value={formValues.currentPassword}
              autoComplete="current-password"
              onChange={handleChange("currentPassword")}
            />
            <TextValidator
              margin="normal"
              validators={["required"]}
              errorMessages={["this field is required"]}
              fullWidth
              name="new-password"
              label="Enter New Password"
              type="password"
              id="password"
              value={formValues.newPassword}
              autoComplete="current-password"
              onChange={handleChange("newPassword")}
            />
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