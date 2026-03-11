import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const ServicesList = lazy(() => import("./components"));
const ServiceForm = lazy(() => import("./components/ServiceForm"));

function ServicesRoutes() {
  return (
    <Routes>
      <Route index element={<ServicesList />} />
      <Route path="add" element={<ServiceForm />} />
      <Route path="edit/:id" element={<ServiceForm />} />
    </Routes>
  );
}

export default ServicesRoutes;
