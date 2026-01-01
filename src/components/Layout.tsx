import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export default function Layout() {
  const { lock } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLock = () => {
    lock();
    navigate('/unlock');
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <button className="menu-button" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          ☰
        </button>
        <span className="brand">Service Tracker</span>
      </div>

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
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
      {mobileOpen ? <div className="backdrop" onClick={() => setMobileOpen(false)} /> : null}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
