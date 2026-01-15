import { lazy } from "react";

import { Route, Routes } from "react-router-dom";
import clsx from "clsx";

import withAuth from "../shared/component/withAuth";

import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { UserProvider } from "../context/UserDataContext";

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
