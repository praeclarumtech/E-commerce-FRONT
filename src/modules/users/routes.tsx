import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const UsersList = lazy(() => import("./components"));
const UserForm = lazy(() => import("./components/UserForm"));

function UsersRoutes() {
  return (
    <Routes>
      <Route index element={<UsersList />} />
      <Route path="add" element={<UserForm />} />
      <Route path="edit/:id" element={<UserForm />} />
    </Routes>
  );
}

export default UsersRoutes;