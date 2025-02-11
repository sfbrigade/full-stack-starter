import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router';
import { Box, Button, Container, Group, Stack, TextInput, Title } from '@mantine/core';

import Api from '../Api';
import { useStaticContext } from '../StaticContext';

function ForgotPassword () {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);

  function onSubmit (event) {
    event.preventDefault();
    setShowError(false);
    Api.passwords
      .reset(email)
      .then(() => {
        navigate('/login', { state: { flash: 'Please check your email in a few minutes for a reset password link.' } });
      })
      .catch(() => setShowError(true));
  }

  return (
    <>
      <Helmet>
        <title>Forgot your password? - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title mb='md'>Forgot your password?</Title>
        <form onSubmit={onSubmit}>
          <Stack w={{ base: '100%', xs: 320 }}>
            <Box>Enter the email address you registered to receive a reset password link.</Box>
            <TextInput
              label='Email'
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={showError ? 'Email not found.' : ''}
            />
            <Group>
              <Button type='submit'>Submit</Button>
            </Group>
            <Box>
              <Link to='/login'>Back to login...</Link>
            </Box>
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default ForgotPassword;
