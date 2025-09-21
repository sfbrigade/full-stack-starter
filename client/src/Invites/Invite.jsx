import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Container, Stack, Title } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Head } from '@unhead/react';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import RegistrationForm from '../RegistrationForm';

function Invite () {
  const { setUser: setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const { inviteId } = useParams();

  const { data: invite } = useQuery({
    queryKey: ['invite', inviteId],
    queryFn: async () => {
      const response = await Api.invites.get(inviteId);
      setAuthUser(null);
      return response.data;
    },
  });

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const onSubmitMutation = useMutation({
    mutationFn: () => Api.auth.register({ ...user, inviteId }),
    onSuccess: (response) => {
      setAuthUser(response.data);
      navigate('/account', { state: { flash: 'Your account has been created!' } });
    },
    onError: () => window.scrollTo(0, 0),
  });

  function onChange (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  return (
    <>
      <Head>
        <title>You&apos;re Invited</title>
      </Head>
      <Container>
        <Title mb='md'>You&apos;re Invited</Title>
        <Stack>
          {invite?.acceptedAt && <Box>This invite has already been accepted.</Box>}
          {invite?.revokedAt && <Box>This invite is no longer available.</Box>}
          {invite && invite.acceptedAt === null && invite.revokedAt === null && (
            <RegistrationForm onSubmitMutation={onSubmitMutation} onChange={onChange} user={user} />
          )}
        </Stack>
      </Container>
    </>
  );
}
export default Invite;
