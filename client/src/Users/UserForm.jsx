import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Alert, Button, Checkbox, Container, Group, Stack, TextInput, Title } from '@mantine/core';
import { Head } from '@unhead/react';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import PhotoInput from '../Components/PhotoInput';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function UserForm () {
  const authContext = useAuthContext();
  const location = useLocation();
  const params = useParams();
  const userId = params.userId ?? authContext.user.id;

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    picture: '',
    isAdmin: false,
  });
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      Api.users.get(userId).then((response) =>
        setUser({
          ...response.data,
          password: '',
        })
      );
    }
  }, [userId]);

  function onChange (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  function onToggle (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.checked;
    setUser(newUser);
  }

  async function onSubmit (event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const response = await Api.users.update(user.id, user);
      if (user.id === authContext.user.id) {
        authContext.setUser(response.data);
      }
      setSuccess(true);
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
      <Head>
        <title>My Account</title>
      </Head>
      <Container>
        <Title mb='md'>My Account</Title>
        <form onSubmit={onSubmit}>
          <Stack w={{ base: '100%', xs: 320 }}>
            {location.state?.flash && <Alert>{location.state?.flash}</Alert>}
            {error && error.message && <Alert color='red'>{error.message}</Alert>}
            {success && <Alert>Your account has been updated!</Alert>}
            <PhotoInput
              label='Picture'
              id='picture'
              name='picture'
              value={user.picture}
              valueUrl={user.pictureUrl}
              onChange={onChange}
              onUploading={setUploading}
              error={error?.errorMessagesHTMLFor?.('picture')}
            />
            <TextInput
              label='First name'
              type='text'
              id='firstName'
              name='firstName'
              onChange={onChange}
              value={user.firstName}
              error={error?.errorMessagesHTMLFor?.('firstName')}
            />
            <TextInput
              label='Last name'
              type='text'
              id='lastName'
              name='lastName'
              onChange={onChange}
              value={user.lastName}
              error={error?.errorMessagesHTMLFor?.('lastName')}
            />
            <TextInput
              label='Email'
              type='email'
              id='email'
              name='email'
              onChange={onChange}
              value={user.email}
              error={error?.errorMessagesHTMLFor?.('email')}
            />
            <TextInput
              label='Password'
              type='password'
              id='password'
              name='password'
              onChange={onChange}
              value={user.password}
              error={error?.errorMessagesHTMLFor?.('password')}
            />
            {authContext.user.isAdmin && (
              <Checkbox
                label='Is an Administrator?'
                id='isAdmin'
                name='isAdmin'
                onChange={onToggle}
                checked={user.isAdmin}
                error={error?.errorMessagesHTMLFor?.('isAdmin')}
              />
            )}
            <Group>
              <Button disabled={isUploading} type='submit'>Submit</Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </>
  );
}

export default UserForm;
