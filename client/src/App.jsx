import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import '@mantine/core/styles.css';
import { AppShell, Container, Loader, MantineProvider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

import './App.css';

import AuthContextProvider from './AuthContextProvider';
import { useStaticContext } from './StaticContext';
import AppRedirects from './AppRedirects';
import AppTheme from './AppTheme';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import InvitesRoutes from './Invites/InvitesRoutes';
import PasswordsRoutes from './Passwords/PasswordsRoutes';
import Register from './Register';
import UsersRoutes from './Users/UsersRoutes';

const AdminRoutes = lazy(() => import('./Admin/AdminRoutes'));

function App () {
  const [opened, { close, toggle }] = useDisclosure();
  const staticContext = useStaticContext();

  return (
    <MantineProvider theme={AppTheme}>
      <ModalsProvider>
        <AuthContextProvider>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding='md'
          >
            <AppShell.Header>
              <Header opened={opened} close={close} toggle={toggle} />
            </AppShell.Header>
            <AppShell.Navbar />
            <AppShell.Main px={0}>
              <Routes>
                <Route
                  path='*'
                  element={
                    <AppRedirects>
                      <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/passwords/*' element={<PasswordsRoutes />} />
                        <Route path='/invites/*' element={<InvitesRoutes />} />
                        {staticContext?.env?.VITE_FEATURE_REGISTRATION === 'true' && <Route path='/register' element={<Register />} />}
                        <Route path='/account/*' element={<UsersRoutes />} />
                        <Route
                          path='/admin/*' element={
                            <Suspense fallback={<Container ta='center'><Loader /></Container>}>
                              <AdminRoutes />
                            </Suspense>
                      }
                        />
                      </Routes>
                    </AppRedirects>
              }
                />
              </Routes>
            </AppShell.Main>
          </AppShell>
        </AuthContextProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
