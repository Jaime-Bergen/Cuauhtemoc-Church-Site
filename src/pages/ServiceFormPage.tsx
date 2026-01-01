import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';

const emptySongs = ['', '', ''];

export default function ServiceFormPage() {
  const { addService, updateService, services } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [sundaySchoolSongleader, setSsLead] = useState('');
  const [sundaySchoolSongs, setSsSongs] = useState([...emptySongs]);
  const [churchSongleader, setChurchLead] = useState('');
  const [churchSongs, setChurchSongs] = useState([...emptySongs]);
  const [messageTitle, setMessageTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [notes, setNotes] = useState('');
  const [recordingLink, setRecordingLink] = useState('');

  useEffect(() => {
    if (!id) return;
    const svc = services.find((s) => s.id === id);
    if (!svc) return;
    setDate(svc.date);
    setSsLead(svc.sundaySchoolSongleader);
    setSsSongs(svc.sundaySchoolSongs.length ? svc.sundaySchoolSongs : [...emptySongs]);
    setChurchLead(svc.churchSongleader);
    setChurchSongs(svc.churchSongs.length ? svc.churchSongs : [...emptySongs]);
    setMessageTitle(svc.messageTitle);
    setPreacher(svc.preacher);
    setNotes(svc.notes || '');
    setRecordingLink(svc.recordingLink || '');
  }, [id, services]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      date,
      sundaySchoolSongleader,
      sundaySchoolSongs,
      churchSongleader,
      churchSongs,
      messageTitle,
      preacher,
      notes,
      recordingLink
    };
    if (id) {
      updateService(id, payload);
    } else {
      addService(payload);
    }
    navigate('/services');
  };

  const renderSongInputs = (values: string[], setValues: (arr: string[]) => void, idPrefix: string) => (
    <div className="input-row">
      {values.map((val, idx) => (
        <input
          key={`${idPrefix}-${idx}`}
          value={val}
          onChange={(e) => {
            const next = [...values];
            next[idx] = e.target.value;
            setValues(next);
          }}
          placeholder={`Song ${idx + 1} #`}
        />
      ))}
    </div>
  );

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading">{id ? 'Edit service' : 'Add service'}</h1>
          <p className="subheading">Capture song leaders, songs, and the message.</p>
        </div>
      </div>

      <form className="grid" style={{ gap: 16 }} onSubmit={handleSubmit}>
        <div className="panel grid" style={{ gap: 12 }}>
          <div className="input-group">
            <label htmlFor="date">Date</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Sunday School song leader</label>
            <input value={sundaySchoolSongleader} onChange={(e) => setSsLead(e.target.value)} placeholder="Name" />
            <div className="helper">List up to three song numbers.</div>
            {renderSongInputs(sundaySchoolSongs, setSsSongs, 'ss')}
          </div>

          <div className="input-group">
            <label>Church song leader</label>
            <input value={churchSongleader} onChange={(e) => setChurchLead(e.target.value)} placeholder="Name" />
            <div className="helper">List up to three song numbers.</div>
            {renderSongInputs(churchSongs, setChurchSongs, 'ch')}
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Message title</label>
              <input value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} placeholder="Title" />
            </div>
            <div className="input-group">
              <label>Preacher</label>
              <input value={preacher} onChange={(e) => setPreacher(e.target.value)} placeholder="Name" />
            </div>
          </div>

          <div className="input-group">
            <label>Recording link (optional)</label>
            <input
              value={recordingLink}
              onChange={(e) => setRecordingLink(e.target.value)}
              placeholder="Paste a URL if you have one"
            />
          </div>

          <div className="input-group">
            <label>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Observations, announcements, etc." />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" type="submit">
            Save service
          </button>
          <button className="btn secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
