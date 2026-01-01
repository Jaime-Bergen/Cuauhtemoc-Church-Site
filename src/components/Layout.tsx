import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Layout() {
  const { lock } = useData();
  const navigate = useNavigate();

  const handleLock = () => {
    lock();
    navigate('/unlock');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>Service Tracker</span>
        </div>
        <nav className="nav">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/services/new">Add Service</NavLink>
          <NavLink to="/appointments">Appointments</NavLink>
          <NavLink to="/responsibilities">Responsibilities</NavLink>
          <NavLink to="/members">Members</NavLink>
          <button className="btn secondary" onClick={handleLock} style={{ marginTop: 12 }}>
            Lock
          </button>
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
