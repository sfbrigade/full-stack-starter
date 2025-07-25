import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Alert, Box, Button, Container, Group, Stack, TextInput, Title } from '@mantine/core';
import { Head } from '@unhead/react';

import Api from './Api';
import { useAuthContext } from './AuthContext';
import { useStaticContext } from './StaticContext';

function Login () {
  const staticContext = useStaticContext();
  const authContext = useAuthContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const from = location.state?.from || searchParams.get('from') || '/';

  useEffect(() => {
    if (authContext.user) {
      navigate(from, { replace: true });
    }
  }, [authContext.user, from, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showInvalidError, setShowInvalidError] = useState(false);

  async function onSubmit (event) {
    event.preventDefault();
    setShowInvalidError(false);
    try {
      const response = await Api.auth.login(email, password);
      authContext.setUser(response.data);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY || error.response?.status === StatusCodes.NOT_FOUND) {
        setShowInvalidError(true);
      } else {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Log in</title>
      </Head>
      <Container>
        <Title mb='md'>Log in</Title>
        <form onSubmit={onSubmit}>
          <Stack w={{ base: '100%', xs: 320 }}>
            {location.state?.flash && <Alert>{location.state?.flash}</Alert>}
            {showInvalidError && <Alert color='red'>Invalid email and/or password.</Alert>}
            <TextInput
              label='Email'
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              label='Password'
              type='password'
              id='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Group>
              <Button type='submit'>
                Submit
              </Button>
            </Group>
            <Box>
              <Link to='/passwords/forgot'>Forgot your password?</Link>
              {staticContext?.env?.VITE_FEATURE_REGISTRATION === 'true' && (
                <>
                  <br />
                  <Link to='/register'>Need an account?</Link>
                </>
              )}
            </Box>
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default Login;
