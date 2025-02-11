import { useEffect } from 'react';
import { useNavigate, Link, NavLink } from 'react-router';
import { StatusCodes } from 'http-status-codes';
import { Burger, Container, Group, Title } from '@mantine/core';

import './Header.scss';
import Api from './Api';
import { useAuthContext } from './AuthContext';

function Header ({ opened, close, toggle }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();

  useEffect(
    function () {
      Api.users.me().then((response) => {
        if (response.status === StatusCodes.OK) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      });
    },
    [setUser]
  );

  async function onLogout (event) {
    event.preventDefault();
    await Api.auth.logout();
    setUser(null);
    close();
    navigate('/');
  }

  return (
    <Container h='100%'>
      <Group h='100%' align='center' justify='space-between'>
        <Link to='/' onClick={close}>
          <Title>Full Stack Starter</Title>
        </Link>
        <Group visibleFrom='sm'>
          <NavLink aria-current='page' to='/' onClick={close}>
            Home
          </NavLink>
          {user && (
            <>
              {user.isAdmin && (
                <NavLink to='/admin' onClick={close}>
                  Admin
                </NavLink>
              )}
              <Group>
                <span>
                  Hello,{' '}
                  <NavLink to='/account' onClick={close}>
                    {user.firstName}!
                  </NavLink>
                </span>
                {user.pictureUrl && <div className='header__picture' style={{ backgroundImage: `url(${user.pictureUrl})` }} />}
              </Group>
              <a href='/logout' onClick={onLogout}>
                Log out
              </a>
            </>
          )}
          {!user && (
            <NavLink to='/login' onClick={close}>
              Log in
            </NavLink>
          )}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom='sm' size='sm' />
      </Group>
    </Container>
  );
}

export default Header;
