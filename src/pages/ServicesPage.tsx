import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function ServicesPage() {
  const { services, removeService } = useData();

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading">Services</h1>
          <p className="subheading">Log song leaders, songs, and message details.</p>
        </div>
        <Link className="btn" to="/services/new">
          Add service
        </Link>
      </div>

      <div className="list">
        {services.length === 0 ? (
          <p className="helper">No services yet.</p>
        ) : (
          services.map((svc) => (
            <div key={svc.id} className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div className="tag">{format(parseISO(svc.date), 'EEE, MMM d, yyyy')}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link className="btn secondary" to={`/services/${svc.id}/edit`}>
                    Edit
                  </Link>
                  <button className="btn secondary" onClick={() => removeService(svc.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <h3 style={{ marginBottom: 6 }}>{svc.messageTitle}</h3>
              <p className="helper">Preacher: {svc.preacher}</p>
              <p className="helper">Sunday School: {svc.sundaySchoolSongleader} — {svc.sundaySchoolSongs.join(', ') || '—'}</p>
              <p className="helper">Church: {svc.churchSongleader} — {svc.churchSongs.join(', ') || '—'}</p>
              {svc.notes ? <p className="helper">Notes: {svc.notes}</p> : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
