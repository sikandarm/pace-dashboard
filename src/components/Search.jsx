import { OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from '../components/iconify';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <OutlinedInput
      sx={{
        width: 240,
        margin: '20px',
        transition: 'box-shadow 0.3s, width 0.3s',
        '&.Mui-focused': {
          width: 320,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        },
        '& fieldset': {
          borderWidth: '1px !important',
          borderColor: 'rgba(0, 0, 0, 0.2) !important',
        },
      }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
    />
  );
};

export default SearchInput;
