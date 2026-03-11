import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const Roles = lazy(() => import('./components'));

function RolesRoutes() {
  return (
    <Routes>
      <Route index element={<Roles />} />
      <Route path="add" element={<Roles />} />
      <Route path="edit/:id" element={<Roles />} />
    </Routes>
  )
}

export default RolesRoutes