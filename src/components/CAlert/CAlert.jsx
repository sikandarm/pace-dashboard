import * as React from 'react';
import Alert from '@mui/material/Alert';

export default function CAlert(props) {
  console.log('-=>', props);
  return (
    <Alert severity={props.type} color={props.color}>
      {props.message}
    </Alert>
  );
}
