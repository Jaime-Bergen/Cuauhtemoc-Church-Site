import { FormEvent, useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useData } from '../context/DataContext';
import { ResponsibilityFrequency } from '../types';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekOfMonthOptions: Array<{ label: string; value: number | 'last' }> = [
  { label: '1st', value: 1 },
  { label: '2nd', value: 2 },
  { label: '3rd', value: 3 },
  { label: '4th', value: 4 },
  { label: 'Last', value: 'last' }
];

export default function ResponsibilitiesPage() {
  const {
    members,
    responsibilities,
    upcomingResponsibilities,
    addResponsibility,
    updateResponsibility,
    removeResponsibility,
    setAssignment
  } = useData();

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<ResponsibilityFrequency>('weekly');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([3]);
  const [monthDay, setMonthDay] = useState<number>(0);
  const [weekOfMonth, setWeekOfMonth] = useState<number | 'last'>(1);
  const [customDate, setCustomDate] = useState('');
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const memberLookup = useMemo(() => new Map(members.map((m) => [m.id, m.name])), [members]);

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const addCustomDate = () => {
    if (!customDate) return;
    if (!customDates.includes(customDate)) {
      setCustomDates((prev) => [...prev, customDate]);
    }
    setCustomDate('');
  };

  const removeCustomDate = (date: string) => setCustomDates((prev) => prev.filter((d) => d !== date));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (frequency === 'weekly' && daysOfWeek.length === 0) return;
    if (frequency === 'monthly' && daysOfWeek.length === 0) return;
    const payload = {
      title: title.trim(),
      frequency,
      daysOfWeek: frequency === 'monthly' ? [monthDay] : daysOfWeek,
      weekOfMonth: frequency === 'monthly' ? weekOfMonth : undefined,
      customDates: frequency === 'custom' ? customDates : undefined
    } as const;
    if (editingId) {
      updateResponsibility(editingId, payload);
    } else {
      addResponsibility(payload);
    }
    setTitle('');
    setDaysOfWeek([3]);
    setMonthDay(0);
    setWeekOfMonth(1);
    setCustomDates([]);
    setEditingId(null);
  };

  useEffect(() => {
    if (!editingId) return;
    const resp = responsibilities.find((r) => r.id === editingId);
    if (!resp) return;
    setTitle(resp.title);
    setFrequency(resp.frequency);
    setDaysOfWeek(resp.frequency === 'monthly' ? [resp.daysOfWeek?.[0] ?? 0] : resp.daysOfWeek ?? [3]);
    setMonthDay(resp.daysOfWeek?.[0] ?? 0);
    setWeekOfMonth(resp.weekOfMonth ?? 1);
    setCustomDates(resp.customDates ?? []);
  }, [editingId, responsibilities]);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="heading">Responsibilities</h1>
          <p className="subheading">
            Define recurring duties (songleading, youth teachers, cleaning) and assign people to each occurrence.
          </p>
        </div>
      </div>

      <div className="panel">
          <h2 className="subheading">{editingId ? 'Edit responsibility' : 'Add responsibility'}</h2>
        <form className="grid" style={{ gap: 12 }} onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Wednesday Songleader" />
            </div>
            <div className="input-group">
              <label>Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as ResponsibilityFrequency)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom dates</option>
              </select>
            </div>
          </div>

          {frequency === 'weekly' && (
            <div className="input-group">
              <label>Days of week</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {dayNames.map((name, idx) => (
                  <button
                    key={name}
                    type="button"
                    className="btn secondary"
                    style={{
                      background: daysOfWeek.includes(idx) ? 'rgba(52, 211, 153, 0.18)' : 'rgba(255,255,255,0.06)',
                      borderColor: daysOfWeek.includes(idx) ? 'rgba(52, 211, 153, 0.8)' : undefined
                    }}
                    onClick={() => toggleDay(idx)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === 'monthly' && (
            <div className="grid" style={{ gap: 10 }}>
              <div className="input-row">
                <div className="input-group">
                  <label>Week</label>
                  <select
                    value={weekOfMonth}
                    onChange={(e) => setWeekOfMonth(e.target.value === 'last' ? 'last' : Number(e.target.value))}
                  >
                    {weekOfMonthOptions.map((opt) => (
                      <option key={opt.label} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Day of week</label>
                  <select value={monthDay} onChange={(e) => setMonthDay(Number(e.target.value))}>
                    {dayNames.map((name, idx) => (
                      <option key={name} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {frequency === 'custom' && (
            <div className="grid" style={{ gap: 8 }}>
              <div className="input-row">
                <div className="input-group">
                  <label>Date</label>
                  <input type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
                </div>
                <div style={{ alignSelf: 'end' }}>
                  <button className="btn secondary" type="button" onClick={addCustomDate}>
                    Add date
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {customDates.length === 0 ? (
                  <p className="helper">Add one or more dates.</p>
                ) : (
                  customDates.map((d) => (
                    <span key={d} className="tag" style={{ gap: 4 }}>
                      {format(parseISO(d), 'MMM d, yyyy')}
                      <button className="btn secondary" type="button" onClick={() => removeCustomDate(d)}>
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="submit">
              {editingId ? 'Update responsibility' : 'Save responsibility'}
            </button>
            {editingId ? (
              <button className="btn secondary" type="button" onClick={() => setEditingId(null)}>
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2 className="subheading">Upcoming assignments</h2>
        <div className="list">
          {upcomingResponsibilities.length === 0 ? (
            <p className="helper">No scheduled responsibilities yet.</p>
          ) : (
            upcomingResponsibilities.map((occ) => {
              const assignedName = occ.assignedMemberId ? memberLookup.get(occ.assignedMemberId) : undefined;
              return (
                <div key={`${occ.responsibilityId}-${occ.date}`} className="card" style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div className="tag">{format(parseISO(occ.date), 'EEE, MMM d, yyyy')}</div>
                    <div className="tag">{occ.title}</div>
                  </div>
                  <div className="input-row">
                    <div className="input-group">
                      <label>Assigned</label>
                      <select
                        value={occ.assignedMemberId || ''}
                        onChange={(e) => setAssignment(occ.responsibilityId, occ.date, e.target.value || undefined)}
                      >
                        <option value="">Unassigned</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                      <div className="helper">Pick who is on for this slot.</div>
                    </div>
                    {assignedName ? <div className="input-group"><label>Current</label><div className="tag">{assignedName}</div></div> : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="panel">
        <h2 className="subheading">Responsibilities</h2>
        <div className="list">
          {responsibilities.length === 0 ? (
            <p className="helper">No responsibilities yet.</p>
          ) : (
            responsibilities.map((r) => (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{r.title}</h3>
                  <p className="helper">
                    {r.frequency === 'weekly' && `Weekly on ${r.daysOfWeek?.map((d) => dayNames[d]).join(', ')}`}
                    {r.frequency === 'monthly' && `Monthly on ${weekOfMonthOptions.find((o) => o.value === (r.weekOfMonth ?? 1))?.label || ''} ${r.daysOfWeek ? dayNames[r.daysOfWeek[0]] : ''}`}
                    {r.frequency === 'custom' && `${r.customDates?.length || 0} custom dates`}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn secondary" onClick={() => setEditingId(r.id)}>
                    Edit
                  </button>
                  <button className="btn secondary" onClick={() => removeResponsibility(r.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
