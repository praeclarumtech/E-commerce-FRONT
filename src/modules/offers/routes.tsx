import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const OffersList = lazy(() => import("./components"));
const OfferForm = lazy(() => import("./components/OfferForm"));

function OffersRoutes() {
  return (
    <Routes>
      <Route index element={<OffersList />} />
      <Route path="add" element={<OfferForm />} />
      <Route path="edit/:id" element={<OfferForm />} />
    </Routes>
  );
}

export default OffersRoutes;
