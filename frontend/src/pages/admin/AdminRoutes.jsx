import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from '../../components/layout/AdminLayout.jsx';
import { RequireAuth } from '../../components/auth/RequireAuth.jsx';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';
import Orders from './Orders.jsx';
import Products from './Products.jsx';

// Mounted lazily at /admin/* so the storefront bundle never carries Recharts
// or the dashboard code.
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
