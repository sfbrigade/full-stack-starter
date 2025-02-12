import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Alert, Button, Container, Fieldset, Group, Stack, Textarea, TextInput, Title } from '@mantine/core';

import Api from '../../Api';
import UnexpectedError from '../../UnexpectedError';
import ValidationError from '../../ValidationError';
import { useStaticContext } from '../../StaticContext';

function AdminUserInvite () {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const [invite, setInvite] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onChange (event) {
    const newInvite = { ...invite };
    newInvite[event.target.name] = event.target.value;
    setInvite(newInvite);
  }

  async function onSubmit (event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await Api.invites.create(invite);
      navigate('/admin/users', { flash: 'Invite sent!' });
    } catch (error) {
      setLoading(false);
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
      window.scrollTo(0, 0);
    }
  }

  return (
    <>
      <Helmet>
        <title>Invite a new User - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title mb='md'>Invite a new User</Title>
        <form onSubmit={onSubmit}>
          <Fieldset variant='unstyled' disabled={isLoading}>
            <Stack w={{ base: '100%', xs: 320 }}>
              {error && error.message && <Alert color='red'>{error.message}</Alert>}
              <TextInput
                label='First name'
                type='text'
                id='firstName'
                name='firstName'
                onChange={onChange}
                value={invite.firstName ?? ''}
                error={error?.errorMessagesHTMLFor?.('firstName')}
              />
              <TextInput
                label='Last name'
                type='text'
                id='lastName'
                name='lastName'
                onChange={onChange}
                value={invite.lastName ?? ''}
                error={error?.errorMessagesHTMLFor?.('lastName')}
              />
              <TextInput
                label='Email'
                type='email'
                id='email'
                name='email'
                onChange={onChange}
                value={invite.email ?? ''}
                error={error?.errorMessagesHTMLFor?.('email')}
              />
              <Textarea
                label='Message'
                id='message'
                name='message'
                onChange={onChange}
                value={invite.message ?? ''}
                error={error?.errorMessagesHTMLFor?.('message')}
              />
              <Group>
                <Button type='submit'>
                  Submit
                </Button>
              </Group>
            </Stack>
          </Fieldset>
        </form>
      </Container>
    </>
  );
}

export default AdminUserInvite;
