import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const BrandsList = lazy(() => import("./components"));
const BrandForm = lazy(() => import("./components/BrandForm"));

function BrandsRoutes() {
  return (
    <Routes>
      <Route index element={<BrandsList />} />
      <Route path="add" element={<BrandForm />} />
      <Route path="edit/:id" element={<BrandForm />} />
    </Routes>
  );
}

export default BrandsRoutes;
