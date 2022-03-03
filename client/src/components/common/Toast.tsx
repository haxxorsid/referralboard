import {
    Alert,
    Button,
    IconButton,
    Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import React from 'react';

export default function Toast(props: any) {  
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
      }
  
      props.setOpen(false);
    };
  
    const action = (
      <React.Fragment>
        <Button color="primary" size="small" onClick={handleClose}>
          Close
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );
    return (
    <Snackbar
    open={props.open}
    autoHideDuration={6000}
    onClose={handleClose}
    action={action}
    >
        <Alert onClose={handleClose} severity={props.severity} sx={{ width: '100%' }}>
            {props.message}
            </Alert>
    </Snackbar>
  );
}
