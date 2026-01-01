import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function DashboardPage() {
  const { services, appointments, upcomingAppointments, recentServices } = useData();
  const lastService = services[0];
  const nextAppointment = upcomingAppointments[0];

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid three">
        <div className="card">
          <p className="helper">Total services logged</p>
          <h3>{services.length}</h3>
        </div>
        <div className="card">
          <p className="helper">Upcoming appointments (90d)</p>
          <h3>{upcomingAppointments.length}</h3>
        </div>
        <div className="card">
          <p className="helper">All appointments</p>
          <h3>{appointments.length}</h3>
        </div>
      </div>

      <div className="grid two">
        <div className="panel">
          <h2 className="subheading">Last service</h2>
          {lastService ? (
            <div className="grid" style={{ gap: 10 }}>
              <div className="tag">{format(parseISO(lastService.date), 'EEE, MMM d')}</div>
              <div className="grid two" style={{ gap: 8 }}>
                <div className="card">
                  <p className="helper">Sunday School Leader</p>
                  <h3>{lastService.sundaySchoolSongleader || '—'}</h3>
                  <p className="helper">Songs: {lastService.sundaySchoolSongs.join(', ') || '—'}</p>
                </div>
                <div className="card">
                  <p className="helper">Church Leader</p>
                  <h3>{lastService.churchSongleader || '—'}</h3>
                  <p className="helper">Songs: {lastService.churchSongs.join(', ') || '—'}</p>
                </div>
              </div>
              <div className="card">
                <p className="helper">Message</p>
                <h3>{lastService.messageTitle || '—'}</h3>
                <p className="helper">Preacher: {lastService.preacher || '—'}</p>
              </div>
            </div>
          ) : (
            <p className="helper">No services yet. <Link to="/services/new">Add one</Link>.</p>
          )}
        </div>

        <div className="panel">
          <h2 className="subheading">Next appointment</h2>
          {nextAppointment ? (
            <div className="grid" style={{ gap: 8 }}>
              <div className="tag">{format(parseISO(nextAppointment.date), 'EEE, MMM d')}</div>
              <h3>{nextAppointment.title}</h3>
              <p className="helper">{nextAppointment.location || 'Location TBD'}</p>
              {nextAppointment.leader ? <p className="helper">Lead: {nextAppointment.leader}</p> : null}
            </div>
          ) : (
            <p className="helper">No upcoming appointments. <Link to="/appointments">Add one</Link>.</p>
          )}
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="subheading">Recent services</h2>
          <Link className="btn secondary" to="/services/new">
            Add service
          </Link>
        </div>
        <div className="list">
          {recentServices.length === 0 ? (
            <p className="helper">You have no logged services yet.</p>
          ) : (
            recentServices.map((svc) => (
              <div key={svc.id} className="card">
                <div className="tag">{format(parseISO(svc.date), 'MMM d, yyyy')}</div>
                <h3>{svc.messageTitle}</h3>
                <p className="helper">Preacher: {svc.preacher}</p>
                <p className="helper">Church songs: {svc.churchSongs.join(', ') || '—'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
