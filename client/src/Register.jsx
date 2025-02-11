import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Box, Container, Stack, Title } from '@mantine/core';

import Api from './Api';
import { useAuthContext } from './AuthContext';
import RegistrationForm from './RegistrationForm';
import UnexpectedError from './UnexpectedError';
import ValidationError from './ValidationError';
import { useStaticContext } from './StaticContext';

function Register () {
  const authContext = useAuthContext();
  const staticContext = useStaticContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  function onChange (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  async function onSubmit (event) {
    event.preventDefault();
    setError(null);
    try {
      const response = await Api.auth.register(user);
      authContext.setUser(response.data);
      navigate('/');
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Register - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title mb='md'>Register</Title>
        <Stack>
          <RegistrationForm onChange={onChange} onSubmit={onSubmit} error={error} user={user} />
          <Box>
            <Link to='/login'>Already have an account?</Link>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default Register;
