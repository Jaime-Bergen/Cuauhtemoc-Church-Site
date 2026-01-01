import { FormEvent, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';

export default function MembersPage() {
  const { members, addMember, updateMember, removeMember } = useData();
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editBirthday, setEditBirthday] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addMember({ name: name.trim(), birthday: birthday || undefined });
    setName('');
    setBirthday('');
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading">Members</h1>
          <p className="subheading">Manage the roster and birthdays; members are available in assignments.</p>
        </div>
      </div>

      <div className="panel">
        <h2 className="subheading">Add member</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="input-group">
              <label>Birthday (optional)</label>
              <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
            </div>
          </div>
          <button className="btn" type="submit">
            Save member
          </button>
        </form>
      </div>

      <div className="panel">
        <h2 className="subheading">Roster</h2>
        <div className="list">
          {members.length === 0 ? (
            <p className="helper">No members yet.</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="card" style={{ display: 'grid', gap: 8 }}>
                {editingId === m.id ? (
                  <form
                    className="grid"
                    style={{ gap: 8 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editName.trim()) return;
                      updateMember(m.id, { name: editName.trim(), birthday: editBirthday || undefined });
                      setEditingId(null);
                    }}
                  >
                    <div className="input-row">
                      <div className="input-group">
                        <label>Name</label>
                        <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </div>
                      <div className="input-group">
                        <label>Birthday (optional)</label>
                        <input type="date" value={editBirthday} onChange={(e) => setEditBirthday(e.target.value)} />
                      </div>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{m.name}</h3>
                      <p className="helper">
                        {m.birthday ? `Birthday: ${format(parseISO(m.birthday), 'MMM d')}` : 'Birthday not set'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn secondary"
                        type="button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditName(m.name);
                          setEditBirthday(m.birthday || '');
                        }}
                      >
                        Edit
                      </button>
                      <button className="btn secondary" onClick={() => removeMember(m.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
