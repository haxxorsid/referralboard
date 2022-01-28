import {Link as RouterLink} from 'react-router-dom';
import { Button, Link, Box, TextField, Grid, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import React from 'react';

export default function EditProfileForm() {
    const [yoe, setYoe] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
      setYoe(event.target.value as string);
    };
    
    return (
        <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
        margin="normal"
        required
        fullWidth
        id="firstname"
        label="First Name"
        name="firstname"
        autoComplete="firstname"
        autoFocus
        />
        <TextField
        margin="normal"
        required
        fullWidth
        id="lastname"
        label="Last Name"
        name="lastname"
        autoComplete="lastname"
        />
        <TextField
        margin="normal"
        required
        fullWidth
        id="location"
        label="Current Location"
        name="location"
        autoComplete="location"
        />
        <TextField
        margin="normal"
        required
        fullWidth
        id="company"
        label="Current Company Name"
        name="company"
        autoComplete="company"
        />
        <TextField
        margin="normal"
        required
        fullWidth
        id="position"
        label="Current Position Title"
        name="position"
        autoComplete="position"
        />
        <TextField
        margin="normal"
        required
        fullWidth
        id="school"
        label="School"
        name="school"
        autoComplete="school"
        />
        <FormControl fullWidth sx={{my: [2, 2]}}>
        <InputLabel id="yoe-label">Years of Experience</InputLabel>
        <Select
        labelId="yoe-label"
        required
        id="yoe"
        value={yoe}
        label="Years of Experience"
        onChange={handleChange}
        >
            <MenuItem value={0}>0 Years / Student / Intern</MenuItem>
            <MenuItem value={1}>0 - 1 Years</MenuItem>
            <MenuItem value={2}>1 - 3 Years</MenuItem>
            <MenuItem value={3}>3 - 5 Years</MenuItem>
            <MenuItem value={4}>5 - 7 Years</MenuItem>
            <MenuItem value={5}>7 - 10 Years</MenuItem>
            <MenuItem value={6}>10+ Years</MenuItem>
            </Select>
        </FormControl>
        <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        />
        <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        />
        <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        >
        Save changes
        </Button>
    </Box>
    );
}