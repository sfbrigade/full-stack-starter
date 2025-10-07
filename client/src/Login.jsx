import { useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Alert, Box, Button, Container, Group, Stack, TextInput, Title } from '@mantine/core';
import { hasLength, isEmail, useForm } from '@mantine/form';
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

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: isEmail('Please enter a valid email address.'),
      password: hasLength({ min: 8 }, 'Passwords must be at least 8 characters.'),
    },
  });

  async function onSubmit (values) {
    try {
      const response = await Api.auth.login(values.email, values.password);
      authContext.setUser(response.data);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY || error.response?.status === StatusCodes.NOT_FOUND) {
        form.setErrors({
          global: 'Invalid email and/or password',
        });
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
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack w={{ base: '100%', xs: 320 }}>
            {location.state?.flash && <Alert>{location.state?.flash}</Alert>}
            {form.errors.global && <Alert color='red'>{form.errors.global}</Alert>}
            <TextInput
              {...form.getInputProps('email')}
              key={form.key('email')}
              label='Email'
            />
            <TextInput
              {...form.getInputProps('password')}
              key={form.key('password')}
              label='Password'
              type='password'
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
