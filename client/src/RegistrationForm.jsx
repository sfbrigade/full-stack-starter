import { Alert, Button, Fieldset, Group, Stack, TextInput } from '@mantine/core';
import { isEmail, isNotEmpty, hasLength, useForm } from '@mantine/form';
import ValidationError from './ValidationError';

function RegistrationForm ({ onSubmitMutation }) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validate: {
      firstName: isNotEmpty('First name is required.'),
      lastName: isNotEmpty('Last name is required.'),
      email: isEmail('Please enter a valid email address.'),
      password: hasLength({ min: 8 }, 'Passwords must be at least 8 characters.'),
    },
  });

  function onSubmit (values) {
    onSubmitMutation.mutateAsync(values, {
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
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Fieldset disabled={onSubmitMutation.isPending} variant='unstyled'>
        <Stack w={{ base: '100%', xs: 320 }}>
          {form.errors.global && <Alert color='red'>{form.errors.global}</Alert>}
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
            type='email'
            label='Email'
          />
          <TextInput
            {...form.getInputProps('password')}
            key={form.key('password')}
            type='password'
            label='Password'
          />
          <Group>
            <Button type='submit'>Submit</Button>
          </Group>
        </Stack>
      </Fieldset>
    </form>
  );
}

export default RegistrationForm;
