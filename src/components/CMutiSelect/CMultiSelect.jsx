import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

export default function CMultiSelect(props) {
  let newData = props.data.filter((item) => {
    return !props.permission.some(
      (p) => p.id === item.id && p.reason === item.reason
    );
  });

  const handleAutocompleteChange = (event, value) => {
    if (value) {
      props.selectedPermissions(
        value.map((i) => {
          if (i.id) {
            return i.id;
          }
          return null;
        })
      );
      return;
    }
  };
  return (
    <Stack
      spacing={3}
      sx={{
        width: props.width ? props.width : 330,
        margin: props.margin ? props.margin : "",
      }}
    >
      <Autocomplete
        disabled={props.disabled ? props.disabled : false}
        multiple
        id="tags-outlined"
        options={newData}
        // value={props.permission.map((item) => item)}
        getOptionLabel={(option) =>
          option.name ? option.name : option.reason ? option.reason : option
        }
        defaultValue={props.permission.map((item) => item)}
        onChange={handleAutocompleteChange}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.label}
            placeholder="Permissions"
          />
        )}
      />
    </Stack>
  );
}
