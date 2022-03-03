import { Button, Box } from '@mui/material';
import React, { useEffect } from 'react';
import { emailFormType, userType } from '../../types';
import {
    ValidatorForm,
    TextValidator
} from 'react-material-ui-form-validator';
import { getUserProfile, updateUserEmail } from '../../common/apiService';

export default function UpdateEmailForm(props: any) {
    const initialFormValues = () => {
        return {
            email: ""
        };
    };

    const [formValues, setFormValues] = React.useState<emailFormType>(initialFormValues());
    const [error, setError] = React.useState(null);

    const handleSubmit = (event: React.FormEvent<Element>) => {
        event.preventDefault();
        updateUserEmail(formValues)
            .then((res: any) => {
                props.displayToast("success", "User email updated");
            })
            .catch((error: any) => {
                props.displayToast("error", error.message);
            });
    };

    const handleChange =
        (prop: keyof emailFormType) => (event: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues({ ...formValues, [prop]: event.target.value });
        };

    const setEmail = (value: string) => {
            setFormValues({ ...formValues, email: value });
        };


    useEffect(() => {
        ValidatorForm.addValidationRule('isTruthy', (value: any) => value);
        getUserProfile()
            .then((res: userType) => {
                setEmail(res.email);
            })
            .catch((error: any) => {
                props.displayToast("error", error.message);
            });
    }, []);

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
                    validators={["required", "isEmail"]}
                    errorMessages={["this field is required", "Not a valid Email address"]}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formValues.email}
                    onChange={handleChange("email")}
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