import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./modules/auth/components/SignIn";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import SignUp from "./modules/auth/components/SignUp";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<AppLayout />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
