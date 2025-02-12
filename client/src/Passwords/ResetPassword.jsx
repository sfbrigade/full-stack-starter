import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, Link } from 'react-router';
import { Alert, Box, Button, Container, Group, Stack, TextInput, Title } from '@mantine/core';

import Api from '../Api';
import { useStaticContext } from '../StaticContext';

function ResetPassword () {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  function onSubmit (event) {
    event.preventDefault();
    setShowError(false);
    setShowInvalid(false);
    Api.passwords
      .update(token, password)
      .then(() => navigate('/login', { state: { flash: 'Your new password has been saved.' } }))
      .catch(() => setShowError(true));
  }

  useEffect(
    function () {
      if (token) {
        Api.passwords
          .get(token)
          .then(() => {})
          .catch((error) => {
            if (error && error.response && error.response.status === 404) {
              setShowInvalid(true);
            } else if (error && error.response && error.response.status === 410) {
              setShowExpired(true);
            }
          });
      }
    },
    [token]
  );

  return (
    <>
      <Helmet>
        <title>Reset your password - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title mb='md'>Reset your password</Title>
        <form onSubmit={onSubmit}>
          <Stack w={{ base: '100%', xs: 320 }}>
            {showInvalid && (
              <Alert color='red'>
                Sorry, this password reset link is invalid.<br />
                <Link to='/passwords/forgot'>Request another?</Link>
              </Alert>
            )}
            {showExpired && (
              <Alert color='red'>
                Sorry, this password reset link has expired.<br />
                <Link to='/passwords/forgot'>Request another?</Link>
              </Alert>
            )}
            {!showExpired && !showInvalid && (
              <>
                <Box>Enter a new password for your account.</Box>
                <TextInput
                  label='New password'
                  type='password'
                  id='password'
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  error={!!showError && 'Minimum eight characters, at least one letter and one number.'}
                />
                <Group>
                  <Button type='submit'>
                    Submit
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default ResetPassword;
