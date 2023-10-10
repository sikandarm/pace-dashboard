import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useMainThemeStyles } from '../../Theme/MainTheme';
import { Button } from '@material-ui/core';

export default function CTextFieldReadOnly(props) {
  const classes = useMainThemeStyles();
  return (
    <Box
      component='form'
      noValidate
      autoComplete='off'
      style={{ position: 'relative' }}>
      {/* <div sx={{ width: '100%',  }}> */}
      <TextField
        fullWidth
        id='outlined-read-only-input'
        defaultValue={props.defaultValue}
        InputProps={{
          readOnly: true,
        }}
      />
      <Button
        className={classes.applyCopun}
        style={{ position: 'absolute', right: 10, top: 10 }}
        variant='outlined'>
        Apply
      </Button>
      {/* </div> */}
    </Box>
  );
}
