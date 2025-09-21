import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Button, Container, Fieldset, Group, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from '../../Api';

function AdminInviteForm () {
  const navigate = useNavigate();

  const [invite, setInvite] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });

  const onSubmitMutation = useMutation({
    mutationFn: () => Api.invites.create(invite),
    onSuccess: () => navigate('/admin/invites', { flash: 'Invite sent!' }),
    onError: () => window.scrollTo(0, 0),
  });

  function onChange (event) {
    const newInvite = { ...invite };
    newInvite[event.target.name] = event.target.value;
    setInvite(newInvite);
  }

  function onSubmit (event) {
    event.preventDefault();
    onSubmitMutation.mutate();
  }

  return (
    <>
      <Head>
        <title>Invite a new User</title>
      </Head>
      <Container>
        <Title mb='md'>Invite a new User</Title>
        <form onSubmit={onSubmit}>
          <Fieldset variant='unstyled' disabled={onSubmitMutation.isPending}>
            <Stack w={{ base: '100%', xs: 320 }}>
              {onSubmitMutation.error && onSubmitMutation.error.message && <Alert color='red'>{onSubmitMutation.error.message}</Alert>}
              <TextInput
                label='First name'
                type='text'
                id='firstName'
                name='firstName'
                onChange={onChange}
                value={invite.firstName ?? ''}
                error={onSubmitMutation.error?.errorMessagesHTMLFor?.('firstName')}
              />
              <TextInput
                label='Last name'
                type='text'
                id='lastName'
                name='lastName'
                onChange={onChange}
                value={invite.lastName ?? ''}
                error={onSubmitMutation.error?.errorMessagesHTMLFor?.('lastName')}
              />
              <TextInput
                label='Email'
                type='email'
                id='email'
                name='email'
                onChange={onChange}
                value={invite.email ?? ''}
                error={onSubmitMutation.error?.errorMessagesHTMLFor?.('email')}
              />
              <Textarea
                label='Message'
                id='message'
                name='message'
                onChange={onChange}
                value={invite.message ?? ''}
                error={onSubmitMutation.error?.errorMessagesHTMLFor?.('message')}
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

export default AdminInviteForm;
