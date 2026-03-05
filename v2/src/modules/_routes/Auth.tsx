import { lazy } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import LayoutAuthenticated from '../dashboard/layout';
import { useAuth } from '../_stores/authSlice';
import SectionMain from '../_components/Section/Main';
import ProfileForm from '../_profile/components/ProfileForm';

const DashboardPage = lazy(() => import('../dashboard/page'));
const ProfilePage = lazy(() => import('../_profile/components'));
const RolesPage = lazy(() => import('../roles/routes'));

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
                </Routes>
            </SectionMain >
        </LayoutAuthenticated>
    )
}

export default Auth