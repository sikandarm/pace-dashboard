import React from 'react';
// import { Button } from '@material-ui/core';
import { Button } from '@mui/material';
// import { AddProduct, updateData } from '../../features/productSlice';

const CButton = (props) => {

  const handleClicks = () => {
    props.onClick();
  };
  console.log(props);
  return (
    <>
      <Button
        disabled={props.disabled ? props.disabled : false}
        variant="outlined"
        style={{
          width: props.Width ? props.Width : 'auto',
          padding: props.Padding ? props.Padding : 'auto',
          backgroundColor: props.backGroundColor ? props.backGroundColor : '',
          color: props.Color ? props.Color : 'black',
        }}
        onClick={handleClicks}
      >
        {props.title}
      </Button>
    </>
  );
};

export default CButton;
