import { lazy } from "react";

import { Route, Routes } from "react-router-dom";
import clsx from "clsx";

import withAuth from "../shared/component/withAuth";

import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { UserProvider } from "../context/UserDataContext";
import CountryForm from "../masterModule/country/component/CountryForm";
import Country from "../masterModule/country/component/Country";
import StateForm from "../masterModule/state/comonent/StateForm";
import State from "../masterModule/state/comonent/State";
import CityForm from "../masterModule/city/component/CityForm";
import City from "../masterModule/city/component/City";

const Profile = lazy(() => import("../modules/profile/components/Profile"));
const Users = lazy(() => import("../modules/users/components/Users"));
const UserForm = lazy(() => import("../modules/users/components/UserForm"));
const Products = lazy(() => import("../modules/products/components/Products"));
const ProductForm = lazy(
  () => import("../modules/products/components/ProductForm")
);
const Categories = lazy(
  () => import("../modules/categories/components/Categories")
);
const CategoryForm = lazy(
  () => import("../modules/categories/components/CategoryForm")
);
const Roles = lazy(() => import("../modules/roles/components/Roles"));
const RoleForm = lazy(() => import("../modules/roles/components/RoleForm"));

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={clsx(
          "flex-1 transition-all duration-300 ease-in-out flex flex-col h-screen",
          {
            "lg:ml-[290px]": isExpanded || isHovered,
            "lg:ml-[90px]": !isExpanded && !isHovered,
            "ml-0": isMobileOpen,
          }
        )}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex-1 w-full overflow-hidden">
          <Routes>
            <Route index element={<>Home</>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<UserForm />} />
            <Route path="/users/edit/:id" element={<UserForm />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductForm />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/roles/add" element={<RoleForm />} />
            <Route path="/roles/edit/:id" element={<RoleForm />} />
            <Route path="/country" element={<Country />} />
            <Route path="/country/add" element={<CountryForm />} />
            <Route path="/country/edit/:id" element={<CountryForm />} />
            <Route path="/state" element={<State />} />
            <Route path="/state/add" element={<StateForm />} />
            <Route path="/state/edit/:id" element={<StateForm />} />
            <Route path="/city" element={<City />} />
            <Route path="/city/add" element={<CityForm />} />
            <Route path="/city/edit/:id" element={<CityForm />} />
            <Route path="*" element={<>Not Found</>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <UserProvider>
        <LayoutContent />
      </UserProvider>
    </SidebarProvider>
  );
};

export default withAuth(AppLayout);
