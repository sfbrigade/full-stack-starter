import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Container, Stack, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from './Api';
import { useAuthContext } from './AuthContext';
import RegistrationForm from './RegistrationForm';

function Register () {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const onSubmitMutation = useMutation({
    mutationFn: () => Api.auth.register(user),
    onSuccess: (response) => {
      authContext.setUser(response.data);
      navigate('/');
    },
    onError: () => window.scrollTo(0, 0),
  });

  function onChange (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <Container>
        <Title mb='md'>Register</Title>
        <Stack>
          <RegistrationForm onChange={onChange} onSubmitMutation={onSubmitMutation} user={user} />
          <Box>
            <Link to='/login'>Already have an account?</Link>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export default Register;
