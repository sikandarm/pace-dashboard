import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// @mui
import { IconButton, InputAdornment, TextField, Container, Box, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../components/iconify';
import { loginUser } from '../feature/userSlice';
import { useDispatch } from 'react-redux';
import Logo from '../components/logo/Logo';
import { validateInput } from '../utils/validateInput';
import { showErrorToast } from '../utils/Toast';
// ----------------------------------------------------------------------

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // const [login, setLogin] = useState({
  //   email: '',
  //   password: '',
  // });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateInput('email', email)) {
      return;
    }
    if (!validateInput('password', password)) {
      return;
    }

    dispatch(loginUser({ email, password })).then((res) => {
      if (res.type === 'login-user/auth/fulfilled') {
        return navigate('/', { replace: true });
      }
      if (res.type === 'login-user/auth/rejected') {
        const { message } = res.error;
        showErrorToast(message);
      }
    });
  };

  return (
    <Container
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          marginBottom: '20px',
        }}
      >
        <Logo />
        <Typography variant="h3">Hi, Welcome Back</Typography>
      </Box>
      <Box>
        <TextField fullWidth name="email" label="Email address" onChange={(e) => setEmail(e.target.value)} />

        <TextField
          fullWidth
          style={{ margin: '10px 0px' }}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin}>
          Login
        </LoadingButton>
        <div style={{ marginTop: '10px' }}>
          <Link to="/reset-password" variant="body2">
            Forgot Password?
          </Link>
        </div>
      </Box>
    </Container>
  );
}
