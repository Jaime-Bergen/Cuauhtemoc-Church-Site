import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function UnlockPage() {
  const { unlock } = useData();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Enter the 4-digit PIN');
      return;
    }
    const ok = unlock(pin);
    if (ok) {
      const next = (location.state as { from?: string })?.from || '/dashboard';
      navigate(next);
    } else {
      setError('Incorrect PIN. Try again.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: '24px' }} className="panel">
      <h1 className="heading">Unlock access</h1>
      <p className="subheading">Enter the shared 4-digit PIN to view and add service notes.</p>
      <form onSubmit={handleSubmit} className="grid" style={{ gap: 14 }}>
        <div className="input-group">
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="1234"
            autoFocus
          />
          <p className="helper">This is stored only in your browser. Share the PIN with friends to let them contribute.</p>
        </div>
        {error ? <div className="alert">{error}</div> : null}
        <button className="btn" type="submit">
          Unlock
        </button>
      </form>
    </div>
  );
}
