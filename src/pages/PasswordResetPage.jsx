import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { validateInput } from '../utils/validateInput';
import { showErrorToast, showSuccessToast } from '../utils/Toast';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@material-ui/icons';

const PasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [isOTPSubmitted, setIsOTPSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_URL;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!validateInput('email', email)) {
        return;
      }

      const resetPasswordUrl = `${baseUrl}/user/forget-password`;
      const response = await axios.post(
        resetPasswordUrl,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        const { message } = response.data;
        showSuccessToast(message);
        setIsEmailSubmitted(true);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/user/verify-otp`, { otp });
      if (response.data.success) {
        const { message } = response.data;
        showSuccessToast(message);
        setIsOTPSubmitted(true);
        setIsLoading(false);
      }
    } catch (error) {
      showErrorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!validateInput('password', password)) {
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        showErrorToast('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const updatePasswordUrl = `${baseUrl}/user/reset-password`;
      const response = await axios.post(
        updatePasswordUrl,
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        const { message } = response.data;
        showSuccessToast(message);
        setIsLoading(false);
        navigate('/login');
      }

      // The rest of your password reset logic here
    } catch (error) {
      showErrorToast(error.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          textAlign: 'center',
          marginBottom: '150px',
        }}
        to="/login"
        variant="body2"
      >
        <ArrowBack
          style={{
            marginRight: '4px',
          }}
        />
        Back to Login
      </Link>

      <Stack spacing={3}>
        <Typography variant="h6">
          {isEmailSubmitted
            ? isOTPSubmitted
              ? 'Enter your new password'
              : 'Enter the OTP sent to your email'
            : 'Enter your email to reset your password'}
        </Typography>

        {!isEmailSubmitted && (
          <form onSubmit={handleEmailSubmit}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              inputMode="email"
              required
              fullWidth
              disabled={isLoading}
            />
            <Button sx={{ marginTop: '10px' }} fullWidth size="large" variant="contained" type="submit">
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
            </Button>
          </form>
        )}

        {isEmailSubmitted && !isOTPSubmitted && (
          <form onSubmit={handleOTPSubmit}>
            <TextField
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              name="otp"
              type="text"
              label="OTP"
              variant="outlined"
              inputMode="numeric"
              required
              fullWidth
              disabled={isLoading}
            />

            <Button sx={{ marginTop: '10px' }} fullWidth size="large" variant="contained" type="submit">
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Verfiy OTP'}
            </Button>
          </form>
        )}

        {isOTPSubmitted && (
          <form onSubmit={handlePasswordSubmit}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              inputMode="password"
              required
              fullWidth
              disabled={isLoading}
            />
            <TextField
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirm password"
              type="password"
              label="Confirm Password"
              variant="outlined"
              inputMode="password"
              required
              fullWidth
              sx={{ marginTop: '20px' }}
            />
            <Button sx={{ marginTop: '10px' }} fullWidth size="large" variant="contained" type="submit">
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
          </form>
        )}
      </Stack>
    </>
  );
};

export default PasswordResetPage;
