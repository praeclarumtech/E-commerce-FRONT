import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Users = lazy(() => import('./components'));

function UsersRoutes() {
  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path="add" element={<Users />} />
      <Route path="edit/:id" element={<Users />} />
    </Routes>
  )
}

export default UsersRoutes
