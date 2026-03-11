import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import LayoutAuthenticated from '../dashboard/layout';
import { useAuth } from '../_stores/authSlice';
import SectionMain from '../_components/Section/Main';

const DashboardPage = lazy(() => import('../dashboard/page'));
const ProfilePage = lazy(() => import('../_profile/components'));
const RolesPage = lazy(() => import('../roles/routes'));
const UsersPage = lazy(() => import('../users/routes'));
const CategoriesPage = lazy(() => import('../categories/routes'));
const BrandsPage = lazy(() => import('../brands/routes'));
const ProductsPage = lazy(() => import('../products/routes'));
const OffersPage = lazy(() => import('../offers/routes'));
const OrdersPage = lazy(() => import('../orders/routes'));
const InventoryPage = lazy(() => import('../inventory/routes'));
const ServicesPage = lazy(() => import('../services/routes'));

function Auth() {

    const isAuthenticated = useAuth((state) => state.isAuthenticated());

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <LayoutAuthenticated>
            <SectionMain>
                <Routes>
                    <Route index element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/roles/*" element={<RolesPage />} />
                    <Route path="/users/*" element={<UsersPage />} />
                    <Route path="/categories/*" element={<CategoriesPage />} />
                    <Route path="/brands/*" element={<BrandsPage />} />
                    <Route path="/products/*" element={<ProductsPage />} />
                    <Route path="/offers/*" element={<OffersPage />} />
                    <Route path="/orders/*" element={<OrdersPage />} />
                    <Route path="/inventory/*" element={<InventoryPage />} />
                    <Route path="/services/*" element={<ServicesPage />} />
                </Routes>
            </SectionMain >
        </LayoutAuthenticated>
    )
}

export default Auth