import { Alert, Button, Fieldset, Group, Stack, TextInput } from '@mantine/core';
import PropTypes from 'prop-types';

function RegistrationForm ({ onChange, onSubmitMutation, user }) {
  function onSubmit (event) {
    event.preventDefault();
    onSubmitMutation.mutate();
  }

  return (
    <form onSubmit={onSubmit}>
      <Fieldset disabled={onSubmitMutation.isPending} variant='unstyled'>
        <Stack w={{ base: '100%', xs: 320 }}>
          {onSubmitMutation.error && onSubmitMutation.error.message && <Alert color='red'>{onSubmitMutation.error.message}</Alert>}
          <TextInput
            label='First name'
            type='text'
            id='firstName'
            name='firstName'
            onChange={onChange}
            value={user.firstName}
            error={onSubmitMutation.error?.errorMessagesHTMLFor?.('firstName')}
          />
          <TextInput
            label='Last name'
            type='text'
            id='lastName'
            name='lastName'
            onChange={onChange}
            value={user.lastName}
            error={onSubmitMutation.error?.errorMessagesHTMLFor?.('lastName')}
          />
          <TextInput
            label='Email'
            type='email'
            id='email'
            name='email'
            onChange={onChange}
            value={user.email}
            error={onSubmitMutation.error?.errorMessagesHTMLFor?.('email')}
          />
          <TextInput
            label='Password'
            type='password'
            id='password'
            name='password'
            onChange={onChange}
            value={user.password}
            error={onSubmitMutation.error?.errorMessagesHTMLFor?.('password')}
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
  onChange: PropTypes.func,
  onSubmitMutation: PropTypes.object,
  user: PropTypes.object,
};

export default RegistrationForm;
