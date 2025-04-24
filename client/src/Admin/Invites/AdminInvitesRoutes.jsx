import { Routes, Route } from 'react-router';

import AdminInviteForm from './AdminInviteForm';
import AdminInvitesList from './AdminInvitesList';

function AdminInvitesRoutes () {
  return (
    <Routes>
      <Route path='new' element={<AdminInviteForm />} />
      <Route path='' element={<AdminInvitesList />} />
    </Routes>
  );
}

export default AdminInvitesRoutes;
