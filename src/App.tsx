import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import UnlockPage from './pages/UnlockPage';
import DashboardPage from './pages/DashboardPage';
import ServicesPage from './pages/ServicesPage';
import ServiceFormPage from './pages/ServiceFormPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ResponsibilitiesPage from './pages/ResponsibilitiesPage';
import MembersPage from './pages/MembersPage';
import Layout from './components/Layout';

function Protected({ children }: { children: JSX.Element }) {
  const { isUnlocked } = useData();
  const location = useLocation();
  if (!isUnlocked) return <Navigate to="/unlock" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/unlock" element={<UnlockPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/new" element={<ServiceFormPage />} />
          <Route path="services/:id/edit" element={<ServiceFormPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="responsibilities" element={<ResponsibilitiesPage />} />
          <Route path="members" element={<MembersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  );
}
