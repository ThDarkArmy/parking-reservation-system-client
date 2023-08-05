import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const SnackBar = ({openSnackbar,setOpenSnackbar, snackbarMessage, snackbarSeverity}) => {
    
  return (
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=>setOpenSnackbar(false) }>
        <Alert onClose={()=>setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
  )
}

export default SnackBar;