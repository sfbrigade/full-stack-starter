import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { Alert, Box, Button, Container, Group, Stack, TextInput, Title } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from '../Api';
import ValidationError from '../ValidationError';

function ResetPassword () {
  const navigate = useNavigate();
  const { token } = useParams();
  const [showExpired, setShowExpired] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  const form = useForm({
    initialValues: {
      password: '',
    },
    validate: {
      password: hasLength({ min: 8 }, 'Passwords must be at least 8 characters.'),
    },
  });

  const onSubmitMutation = useMutation({
    mutationFn: (values) => Api.passwords.update(token, values.password),
    onSuccess: () => navigate('/login', { state: { flash: 'Your new password has been saved.' } }),
    onError: (error) => {
      if (error instanceof ValidationError) {
        form.setErrors(error.data);
      } else if (error?.response?.status === 404) {
        setShowInvalid(true);
      } else if (error?.response?.status === 410) {
        setShowExpired(true);
      }
      window.scrollTo(0, 0);
    },
  });

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
      <Head>
        <title>Reset your password</title>
      </Head>
      <Container>
        <Title mb='md'>Reset your password</Title>
        <form onSubmit={form.onSubmit(onSubmitMutation.mutateAsync)}>
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
                  {...form.getInputProps('password')}
                  key='password'
                  label='New password'
                  type='password'
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
