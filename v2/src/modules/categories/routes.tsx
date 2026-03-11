import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const CategoriesList = lazy(() => import("./components"));
const CategoryForm = lazy(() => import("./components/CategoryForm"));

function CategoriesRoutes() {
  return (
    <Routes>
      <Route index element={<CategoriesList />} />
      <Route path="add" element={<CategoryForm />} />
      <Route path="edit/:id" element={<CategoryForm />} />
    </Routes>
  );
}

export default CategoriesRoutes;
