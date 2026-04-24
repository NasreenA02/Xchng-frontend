import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';
import Alert from '../components/Alert.jsx';

export default function BrowseUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { user }
  const [form, setForm] = useState({ skill_offered: '', skill_requested: '' });
  const [reqLoading, setReqLoading] = useState(false);
  const [reqError, setReqError] = useState('');
  const [reqSuccess, setReqSuccess] = useState('');

  useEffect(() => {
    api.get('/users').then((data) => {
      setUsers(data);
      setFiltered(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      (u.skills_have || []).some((s) => s.toLowerCase().includes(q)) ||
      (u.skills_want || []).some((s) => s.toLowerCase().includes(q))
    ));
  }, [search, users]);

  const openModal = (user) => {
    setModal(user);
    setForm({ skill_offered: '', skill_requested: '' });
    setReqError(''); setReqSuccess('');
  };

  const sendRequest = async () => {
    setReqError(''); setReqSuccess('');
    if (!form.skill_offered || !form.skill_requested) {
      return setReqError('Both fields are required.');
    }
    setReqLoading(true);
    try {
      await api.post('/request', { receiver_id: modal.id, ...form });
      setReqSuccess('Request sent!');
      setTimeout(() => setModal(null), 1200);
    } catch (err) {
      setReqError(err.message);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="page-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</div>
        <div className="page-header">
          <h1 className="page-title">Browse <span className="page-title-accent">Users</span></h1>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by name or skill…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /><p>Loading users…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p>No users found.</p>
          </div>
        ) : (
          <div className="users-grid">
            {filtered.map((u) => (
              <div key={u.id} className="user-card">
                <div
  className="user-card-header"
  style={{ cursor: 'pointer' }}
  onClick={() => navigate(`/user/${u.id}`)}
>
  <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
  <div>
    <div className="user-name" style={{ color: 'var(--accent)' }}>{u.name}</div>
    <div className="user-email">{u.email}</div>
  </div>
</div>
                <div style={{ marginBottom: 10 }}>
                  <div className="skills-label">Offers</div>
                  <div className="tag-list">
                    {(u.skills_have || []).length > 0
                      ? u.skills_have.map((s) => <span key={s} className="tag tag-have">{s}</span>)
                      : <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>None listed</span>}
                  </div>
                </div>
                <div>
                  <div className="skills-label">Wants</div>
                  <div className="tag-list">
                    {(u.skills_want || []).length > 0
                      ? u.skills_want.map((s) => <span key={s} className="tag tag-want">{s}</span>)
                      : <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>None listed</span>}
                  </div>
                </div>
                <div className="user-card-footer">
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={() => openModal(u)}>
                    Send Exchange Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-title">Request Exchange</div>
            <div className="modal-sub">with <strong>{modal.name}</strong></div>
            <Alert type="error">{reqError}</Alert>
            <Alert type="success">{reqSuccess}</Alert>
            <div className="form-group">
              <label className="form-label">Skill You're Offering</label>
              <input className="form-input" placeholder="e.g. Python" value={form.skill_offered} onChange={(e) => setForm({ ...form, skill_offered: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Skill You're Requesting</label>
              <input className="form-input" placeholder="e.g. Guitar" value={form.skill_requested} onChange={(e) => setForm({ ...form, skill_requested: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={sendRequest} disabled={reqLoading}>
                {reqLoading ? <><span className="spinner" /> Sending…</> : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}