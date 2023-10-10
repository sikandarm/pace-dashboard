import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404(props) {
  return (
    <>
      <Helmet>
        <title>{props.loginUser?' 404 Page Not Found | Pace ':'Please Login'}</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            {props.loginUser ? 'Sorry, page not found!':'Please Login'}
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            {props.loginUser ? 'Sorry, we couldn’t find the page you’re looking for Perhaps youve mistyped the URL? Be sure to check your spelling':'Sorry please Login !'}
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/illustration_404.svg"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to={props.loginUser? "/":'/login'} size="large" variant="contained" component={RouterLink}>
            {props.loginUser? 'Go to Home':'Login'}
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}
