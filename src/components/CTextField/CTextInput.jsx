import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function CTextInput({
  defaultValue,
  label,
  status,
  type,
  ref,
  handleInputChange,
  name,
  Width,
  setBoxShadow,
  KeyPress,
  filter
}) {
  return (
    <Box
      sx={{
        maxWidth: Width? Width:216,
        display: "flex",
        flexDirection: "column",
        margin: "5px 3px",
        // '& .MuiTextField-root': { width: '25ch' },
      }}>
      <TextField
        name={name}
        onChange={handleInputChange}
        ref={ref?ref:null}
        type={type ? type : "text"}
        label={label}
        defaultValue={defaultValue}
        disabled={status}
        onKeyPress={filter == 'add-tag'? KeyPress:null}
      />
    </Box>
  );
}
