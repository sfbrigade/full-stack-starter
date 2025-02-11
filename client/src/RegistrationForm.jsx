import { Alert, Button, Fieldset, Group, Stack, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';

function RegistrationForm ({ error, isLoading, onChange, onSubmit, user }) {
  return (
    <form onSubmit={onSubmit}>
      <Fieldset disabled={isLoading} variant='unstyled'>
        <Stack w={{ base: '100%', xs: 320 }}>
          {error && error.message && <Alert color='red'>{error.message}</Alert>}
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
          <Group>
            <Button type='submit'>Submit</Button>
          </Group>
        </Stack>
      </Fieldset>
    </form>
  );
}

RegistrationForm.propTypes = {
  error: PropTypes.instanceOf(Error),
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  user: PropTypes.object,
};

export default RegistrationForm;
