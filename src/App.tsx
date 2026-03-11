import { lazy, Suspense } from 'react';

import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import queryClient from './shared/api/client';
import { useDarkModeStore } from './modules/_stores/darkModeSlice';

function ThemeInit() {
  useDarkModeStore((s) => s.isEnabled);
  return null;
}

const toastClassNames = {
  toast:
    '!rounded-lg !border !px-4 !py-3 !shadow-lg [&[data-type=default]]:!bg-blue-500 [&[data-type=default]]:!border-blue-500 [&[data-type=default]]:!text-white [&[data-type=success]]:!bg-emerald-500 [&[data-type=success]]:!border-emerald-500 [&[data-type=success]]:!text-white [&[data-type=error]]:!bg-red-500 [&[data-type=error]]:!border-red-500 [&[data-type=error]]:!text-white [&[data-type=warning]]:!bg-yellow-500 [&[data-type=warning]]:!border-yellow-500 [&[data-type=warning]]:!text-white [&[data-type=info]]:!bg-blue-500 [&[data-type=info]]:!border-blue-500 [&[data-type=info]]:!text-white',
  title: '!text-inherit',
  description: '!text-inherit',
  closeButton: '!text-inherit !border-0 !bg-transparent hover:!opacity-80',
};

const Auth = lazy(() => import('./modules/_routes/Auth'));
const Login = lazy(() => import('./modules/_auth/components/Login'));
const SignUp = lazy(() => import('./modules/_auth/components/SignUp'));
const ForgotPassword = lazy(() => import('./modules/_auth/components/ForgotPassword'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/e-comm/v2">
        <ThemeInit />
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: toastClassNames,
            duration: 4000,
          }}
        />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*" element={<Auth />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;