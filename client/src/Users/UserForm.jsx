import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Alert, Button, Checkbox, Container, Group, Stack, TextInput, Title } from '@mantine/core';
import { hasLength, isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import PhotoInput from '../Components/PhotoInput';
import ValidationError from '../ValidationError';

function UserForm () {
  const authContext = useAuthContext();
  const location = useLocation();
  const params = useParams();
  const userId = params.userId ?? authContext.user.id;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      picture: '',
      isAdmin: false,
    },
    validate: {
      firstName: isNotEmpty('First name is required.'),
      lastName: isNotEmpty('Last name is required.'),
      email: isEmail('Please enter a valid email address.'),
      password: (value) => value ? hasLength({ min: 8 }, 'Passwords must be at least 8 characters.') : null,
    },
  });

  const onSubmitMutation = useMutation({
    mutationFn: (values) => Api.users.update(userId, values),
    onMutate: () => {
      setSuccess(false);
    },
    onSuccess: (response) => {
      if (userId === authContext.user.id) {
        authContext.setUser(response.data);
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        form.setErrors(error.data);
      } else {
        form.setErrors({
          global: error.toString(),
        });
      }
    },
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      Api.users.get(userId).then((response) => {
        form.setValues({
          ...response.data,
          password: '',
        });
      });
    }
  }, [userId]);

  return (
    <>
      <Head>
        <title>My Account</title>
      </Head>
      <Container>
        <Title mb='md'>My Account</Title>
        <form onSubmit={form.onSubmit(onSubmitMutation.mutateAsync)}>
          <Stack w={{ base: '100%', xs: 320 }}>
            {location.state?.flash && <Alert>{location.state?.flash}</Alert>}
            {form.errors?.global && <Alert color='red'>{form.errors.global}</Alert>}
            {success && <Alert>Your account has been updated!</Alert>}
            {/* <PhotoInput
              label='Picture'
              id='picture'
              name='picture'
              value={user.picture}
              valueUrl={user.pictureUrl}
              onChange={onChange}
              onUploading={setUploading}
              error={error?.errorMessagesHTMLFor?.('picture')}
            /> */}
            <TextInput
              {...form.getInputProps('firstName')}
              key={form.key('firstName')}
              label='First name'
            />
            <TextInput
              {...form.getInputProps('lastName')}
              key={form.key('lastName')}
              label='Last name'
            />
            <TextInput
              {...form.getInputProps('email')}
              key={form.key('email')}
              label='Email'
              type='email'
            />
            <TextInput
              {...form.getInputProps('password')}
              key={form.key('password')}
              label='Password'
              type='password'
            />
            {authContext.user.isAdmin && (
              <Checkbox
                {...form.getInputProps('isAdmin', { type: 'checkbox' })}
                key={form.key('isAdmin')}
                label='Is an Administrator?'
              />
            )}
            <Group>
              <Button disabled={onSubmitMutation.isPending} type='submit'>Submit</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default UserForm;
