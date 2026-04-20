import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';
import Alert from '../components/Alert.jsx';

const StatusBadge = ({ status }) => (
  <span className={`status-badge status-${status}`}>{status}</span>
);

export default function Requests() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('received');
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = () => {
    setLoading(true);
    api.get('/requests').then((data) => {
      setSent(data.sent || []);
      setReceived(data.received || []);
    }).catch(() => setError('Failed to load requests.')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/request/${id}`, { status });
      fetchRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const list = tab === 'sent' ? sent : received;

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="page-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</div>
        <div className="page-header">
          <h1 className="page-title">My <span className="page-title-accent">Requests</span></h1>
        </div>

        <div className="requests-tabs">
          <button className={`req-tab ${tab === 'received' ? 'active' : ''}`} onClick={() => setTab('received')}>
            Received {received.length > 0 && `(${received.length})`}
          </button>
          <button className={`req-tab ${tab === 'sent' ? 'active' : ''}`} onClick={() => setTab('sent')}>
            Sent {sent.length > 0 && `(${sent.length})`}
          </button>
        </div>

        <Alert type="error">{error}</Alert>

        {loading ? (
          <div className="loading-screen"><span className="spinner" /><p>Loading…</p></div>
        ) : list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>No {tab} requests yet.</p>
          </div>
        ) : (
          list.map((r) => (
            <div key={r.id} className="request-card">
              <div className="request-header">
                <div className="request-person">
                  {tab === 'sent'
                    ? <>{r.receiver?.name} <span>{r.receiver?.email}</span></>
                    : <>{r.sender?.name} <span>{r.sender?.email}</span></>}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="request-skills">
                <span className="tag tag-have">{r.skill_offered}</span>
                <span className="req-arrow">⇄</span>
                <span className="tag tag-want">{r.skill_requested}</span>
              </div>
              <div className="request-actions">
                {tab === 'received' && r.status === 'pending' && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => updateStatus(r.id, 'accepted')}>✓ Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r.id, 'rejected')}>✕ Reject</button>
                  </>
                )}
                {tab === 'sent' && r.status === 'pending' && (
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r.id, 'cancelled')}>Cancel</button>
                )}
                {r.status === 'accepted' && (
  <button
    className="btn btn-sm"
    style={{ background: 'rgba(255,200,58,0.12)', color: '#ffc83a', border: '1px solid rgba(255,200,58,0.2)' }}
    onClick={() => navigate(`/ratings?request_id=${r.id}&name=${tab === 'sent' ? r.receiver?.name : r.sender?.name}`)}
  >
    ★ Rate
  </button>
)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}