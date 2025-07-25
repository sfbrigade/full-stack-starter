import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Box, Container, Stack, Title } from '@mantine/core';
import { Head } from '@unhead/react';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import RegistrationForm from '../RegistrationForm';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function Invite () {
  const { setUser: setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const { inviteId } = useParams();
  const [invite, setInvite] = useState(null);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inviteId) {
      Api.invites.get(inviteId).then((response) => {
        setInvite(response.data);
        setAuthUser(null);
      });
    }
  }, [inviteId, setAuthUser]);

  function onChange (event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  async function onSubmit (event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await Api.auth.register({ ...user, inviteId });
      setAuthUser(response.data);
      navigate('/account', { state: { flash: 'Your account has been created!' } });
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
      setLoading(false);
    }
    window.scrollTo(0, 0);
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
            <RegistrationForm onSubmit={onSubmit} onChange={onChange} error={error} user={user} isLoading={isLoading} />
          )}
        </Stack>
      </Container>
    </>
  );
}
export default Invite;
