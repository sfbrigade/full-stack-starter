import { useNavigate } from 'react-router';
import { Alert, Button, Container, Fieldset, Group, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from '../../Api';
import ValidationError from '../../ValidationError';

function AdminInviteForm () {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
    validate: {
      firstName: isNotEmpty('First name is required.'),
      email: isEmail('Please enter a valid email address.'),
    },
  });

  const onSubmitMutation = useMutation({
    mutationFn: (values) => Api.invites.create(values),
    onSuccess: () => navigate('/admin/invites', { flash: 'Invite sent!' }),
    onError: (error) => {
      if (error instanceof ValidationError) {
        form.setErrors(error.data);
      } else {
        form.setErrors({
          global: error.toString(),
        });
      }
      window.scrollTo(0, 0);
    },
  });

  return (
    <>
      <Head>
        <title>Invite a new User</title>
      </Head>
      <Container>
        <Title mb='md'>Invite a new User</Title>
        <form onSubmit={form.onSubmit(onSubmitMutation.mutateAsync)}>
          <Fieldset variant='unstyled' disabled={onSubmitMutation.isPending}>
            <Stack w={{ base: '100%', xs: 320 }}>
              {form.errors.global && <Alert color='red'>{form.errors.global}</Alert>}
              <TextInput
                {...form.getInputProps('firstName')}
                key='firstName'
                label='First name'
              />
              <TextInput
                {...form.getInputProps('lastName')}
                key='lastName'
                label='Last name'
              />
              <TextInput
                {...form.getInputProps('email')}
                key='email'
                label='Email'
                type='email'
              />
              <Textarea
                {...form.getInputProps('message')}
                key='message'
                label='Message'
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
