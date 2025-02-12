import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router';
import { Anchor, Button, Container, Group, Table, Title } from '@mantine/core';
import { DateTime } from 'luxon';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';
import Pagination from '../../Components/Pagination';

function AdminUsersList () {
  const staticContext = useStaticContext();
  const [users, setUsers] = useState([]);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const [invites, setInvites] = useState([]);

  useEffect(() => {
    Api.users.index(page).then((response) => {
      setUsers(response.data);
      const linkHeader = Api.parseLinkHeader(response);
      let newLastPage = page;
      if (linkHeader?.last) {
        const match = linkHeader.last.match(/page=(\d+)/);
        newLastPage = parseInt(match[1], 10);
      } else if (linkHeader?.next) {
        newLastPage = page + 1;
      }
      setLastPage(newLastPage);
    });
    Api.invites.index().then((response) => setInvites(response.data));
  }, [page]);

  async function revoke (invite) {
    const name = `${invite.firstName} ${invite.lastName}`.trim();
    const nameAndEmail = `${name} <${invite.email}>`.trim();
    if (window.confirm(`Are you sure you wish to revoke the invite to ${nameAndEmail}?`)) {
      const response = await Api.invites.revoke(invite.id);
      if (response.status === 200) {
        setInvites(invites.filter((i) => i.id !== invite.id));
      }
    }
  }

  async function resend (invite) {
    const name = `${invite.firstName} ${invite.lastName}`.trim();
    const nameAndEmail = `${name} <${invite.email}>`.trim();
    if (window.confirm(`Are you sure you wish to resend the invite to ${nameAndEmail}?`)) {
      const response = await Api.invites.resend(invite.id);
      if (response.status === 200) {
        for (const inv of invites) {
          if (inv.id === invite.id) {
            inv.updatedAt = response.data.updatedAt;
            break;
          }
        }
        setInvites([...invites]);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Users - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <Container>
        <Title mb='md'>Manage Users</Title>
        <Group mb='lg'>
          <Button component={Link} to='invite'>
            Invite a new User
          </Button>
        </Group>
        {invites.length > 0 && (
          <>
            <Title order={2}>Invites</Title>
            <Table.ScrollContainer mb='lg'>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th w='15%'>First name</Table.Th>
                    <Table.Th w='15%'>Last name</Table.Th>
                    <Table.Th w='20%'>Email</Table.Th>
                    <Table.Th w='20%'>Invited on</Table.Th>
                    <Table.Th w='30%'>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {invites.map((invite) => (
                    <Table.Tr key={invite.id}>
                      <Table.Td>{invite.firstName}</Table.Td>
                      <Table.Td>{invite.lastName}</Table.Td>
                      <Table.Td>
                        <Anchor href={`mailto:${invite.email}`}>{invite.email}</Anchor>
                      </Table.Td>
                      <Table.Td>{DateTime.fromISO(invite.updatedAt).toLocaleString()}</Table.Td>
                      <Table.Td>
                        <Anchor component='button' onClick={() => resend(invite)}>
                          Resend&nbsp;Invite
                        </Anchor>
                        &nbsp;|&nbsp;
                        <Anchor component='button' onClick={() => revoke(invite)}>
                          Revoke&nbsp;Invite
                        </Anchor>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </>
        )}
        <Title order={2}>Users</Title>
        <Table.ScrollContainer>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w='15%'>First name</Table.Th>
                <Table.Th w='15%'>Last name</Table.Th>
                <Table.Th w='20%'>Email</Table.Th>
                <Table.Th w='20%'>Admin?</Table.Th>
                <Table.Th w='30%'>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.firstName}</Table.Td>
                  <Table.Td>{user.lastName}</Table.Td>
                  <Table.Td>
                    <Anchor href={`mailto:${user.email}`}>{user.email}</Anchor>
                  </Table.Td>
                  <Table.Td>{user.isAdmin && 'Admin'}</Table.Td>
                  <Table.Td>
                    <Anchor component={Link} to={`${user.id}`}>Edit&nbsp;Profile</Anchor>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Pagination page={page} lastPage={lastPage} />
        </Table.ScrollContainer>
      </Container>
    </>
  );
}
export default AdminUsersList;
