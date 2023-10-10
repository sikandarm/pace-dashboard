import { Box, Container, Typography } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import Logo from '../components/logo';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  const mdUp = useResponsive('up', 'md');

  return (
    <Container sx={{ display: 'flex', minWidth: '100vW', paddingX: 0 }}>
      <img
        src="/assets/illustrations/pace-login.jpg"
        alt="login"
        style={{ height: '100vh', display: mdUp ? 'block' : 'none' }}
      />

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
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Container>
  );
}
