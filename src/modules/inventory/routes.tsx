import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const InventoryPage = lazy(() => import("./components"));

function InventoryRoutes() {
  return (
    <Routes>
      <Route index element={<InventoryPage />} />
    </Routes>
  );
}

export default InventoryRoutes;
