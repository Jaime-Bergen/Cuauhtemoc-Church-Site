import { FormEvent, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, removeAppointment } = useData();
  const today = new Date().toISOString().slice(0, 16);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today);
  const [location, setLocation] = useState('');
  const [leader, setLeader] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editLeader, setEditLeader] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addAppointment({ title, date, location, leader, notes });
    setTitle('');
    setDate(today);
    setLocation('');
    setLeader('');
    setNotes('');
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading">Appointments</h1>
          <p className="subheading">Keep track of upcoming services, practices, or meetings.</p>
        </div>
      </div>

      <div className="panel">
        <h2 className="subheading">Add appointment</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Youth Night" />
            </div>
            <div className="input-group">
              <label>Date & time</label>
              <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building or address" />
            </div>
            <div className="input-group">
              <label>Leader / contact</label>
              <input value={leader} onChange={(e) => setLeader(e.target.value)} placeholder="Name" />
            </div>
          </div>
          <div className="input-group">
            <label>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Agenda, reminders, etc." />
          </div>
          <button className="btn" type="submit">
            Save appointment
          </button>
        </form>
      </div>

      <div className="panel">
        <h2 className="subheading">Upcoming</h2>
        <div className="list">
          {appointments.length === 0 ? (
            <p className="helper">No appointments yet.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="card" style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="tag">{format(parseISO(appt.date), 'EEE, MMM d, p')}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn secondary"
                      onClick={() => {
                        setEditingId(appt.id);
                        setEditTitle(appt.title);
                        setEditDate(appt.date);
                        setEditLocation(appt.location || '');
                        setEditLeader(appt.leader || '');
                        setEditNotes(appt.notes || '');
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn secondary" onClick={() => removeAppointment(appt.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === appt.id ? (
                  <form
                    className="grid"
                    style={{ gap: 8 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateAppointment(appt.id, {
                        title: editTitle,
                        date: editDate,
                        location: editLocation,
                        leader: editLeader,
                        notes: editNotes
                      });
                      setEditingId(null);
                    }}
                  >
                    <div className="input-row">
                      <div className="input-group">
                        <label>Title</label>
                        <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Date & time</label>
                        <input type="datetime-local" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="input-row">
                      <div className="input-group">
                        <label>Location</label>
                        <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Leader / contact</label>
                        <input value={editLeader} onChange={(e) => setEditLeader(e.target.value)} />
                      </div>
                    </div>
                    <div className="input-group">
                      <label>Notes</label>
                      <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn" type="submit">
                        Save
                      </button>
                      <button className="btn secondary" type="button" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3>{appt.title}</h3>
                    <p className="helper">{appt.location || 'Location TBD'}</p>
                    {appt.leader ? <p className="helper">Lead: {appt.leader}</p> : null}
                    {appt.notes ? <p className="helper">{appt.notes}</p> : null}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
