import { BrowserRouter as Router, Routes, Route } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { ScrollToTop } from "./components/common/ScrollToTop";
import queryClient from "./shared/api/client";
import SignIn from "./modules/auth/components/SignIn";
import AppLayout from "./layout/AppLayout";
import SignUp from "./modules/auth/components/SignUp";
import ChangePassword from "./modules/auth/components/ChangePassword";
import ForgotPassword from "./modules/auth/components/ForgotPassword";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <ToastContainer />
        <Routes>
          <Route path="/*" element={<AppLayout />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
