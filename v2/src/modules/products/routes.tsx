import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const ProductsList = lazy(() => import("./components"));
const ProductForm = lazy(() => import("./components/ProductForm"));

function ProductsRoutes() {
  return (
    <Routes>
      <Route index element={<ProductsList />} />
      <Route path="add" element={<ProductForm />} />
      <Route path="edit/:id" element={<ProductForm />} />
    </Routes>
  );
}

export default ProductsRoutes;
