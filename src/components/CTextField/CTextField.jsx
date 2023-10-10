import React from 'react';
import TextField from '@mui/material/TextField';
const CTextField = (props) => {
  return (
    <TextField
      id={props.label}
      label={props.label}
      variant="outlined"
      disabled={props.disabled ? props.disabled : false}
      fullWidth={props.fullWidth ? props.fullWidth : true}
      style={{
        margin: props.margin ? props.margin : '',
        width: props.width ? props.width : '',
      }}
      required={props.required ? props.required : false}
      onChange={props.onChange}
      name={props.name ? props.name : ''}
      type={props.type ? props.type : 'text'}
      defaultValue={props.defaultValue ? props.defaultValue : ''}
    />
  );
};

export default CTextField;
