import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const OrdersList = lazy(() => import("./components"));

function OrdersRoutes() {
  return (
    <Routes>
      <Route index element={<OrdersList />} />
    </Routes>
  );
}

export default OrdersRoutes;
