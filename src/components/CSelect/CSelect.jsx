import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function CSelect(props) {
  const handleChange = (event) => {
    props.setinitialValue(event.target.value);
  };
  return (
    <Box
      sx={{
        width: props.width ? props.width : '100%',
        padding: props.padding ? props.padding : '0px 8px',
        margin: props.margin ? props.margin : 0,
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
        <Select
          disabled={props.disabled ? props.disabled : false}
          style={{ width: '100%' }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.initialValue ? props.initialValue : ''}
          label={props.label}
          onChange={handleChange}
          required={props.required ? props.required : false}
        >
          {props.data
            ? props.filter === 'users'
              ? props.data.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.firstName}
                  </MenuItem>
                ))
              : props.data.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id ? item.id : item.value ? item.value : item.name ? item.name : item}
                  >
                    {item.name ? item.name : item}
                  </MenuItem>
                ))
            : ''}
        </Select>
      </FormControl>
    </Box>
  );
}
