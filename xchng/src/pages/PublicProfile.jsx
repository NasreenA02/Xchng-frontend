import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/user/${id}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (loading) return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="loading-screen"><span className="spinner" /></div>
    </div>
  );

  if (error) return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <p>{error}</p>
        </div>
      </div>
    </div>
  );

  const { user, taught, learned, ratings, average, total_exchanges } = data;

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="page-back" onClick={() => navigate(-1)}>← Back</div>

        {/* Header */}
        <div className="public-profile-header">
          <div className="public-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <div className="public-name">{user.name}</div>
            <div className="public-email">{user.email}</div>
            <div className="public-meta">
              {average && (
                <div className="public-rating">
                  <span className="public-rating-score">{average}</span>
                  <span className="public-rating-stars">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s}>{s <= Math.round(average) ? '★' : '☆'}</span>
                    ))}
                  </span>
                  <span className="public-rating-count">({ratings.length} review{ratings.length !== 1 ? 's' : ''})</span>
                </div>
              )}
              <span className="public-exchanges-count">
                {total_exchanges} exchange{total_exchanges !== 1 ? 's' : ''} completed
              </span>
              <span style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                Joined {formatDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats-row">
          <div className="profile-stat-card">
            <div className="profile-stat-number">{taught.length}</div>
            <div className="profile-stat-label">Skills Taught</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-number">{learned.length}</div>
            <div className="profile-stat-label">Skills Learned</div>
          </div>
          <div className="profile-stat-card">
            <div className="profile-stat-number">{average ?? '—'}</div>
            <div className="profile-stat-label">Avg Rating</div>
          </div>
        </div>

        {/* Skills Have */}
        <div className="section-card">
          <div className="section-card-title">🟣 Skills Offered</div>
          <div className="tag-list">
            {(user.skills_have || []).length > 0
              ? user.skills_have.map((s) => <span key={s} className="tag tag-have">{s}</span>)
              : <span style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>Nothing listed yet.</span>}
          </div>
        </div>

        {/* Skills Want */}
        <div className="section-card">
          <div className="section-card-title">🩷 Skills Wanted</div>
          <div className="tag-list">
            {(user.skills_want || []).length > 0
              ? user.skills_want.map((s) => <span key={s} className="tag tag-want">{s}</span>)
              : <span style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>Nothing listed yet.</span>}
          </div>
        </div>

        {/* Skills Taught */}
        <div className="section-card">
          <div className="section-card-title">✅ Skills Taught</div>
          {taught.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No completed exchanges yet.</p>
          ) : (
            <div className="exchange-history-grid">
              {taught.map((t, i) => (
                <div key={i} className="exchange-history-item">
                  <div className="exchange-history-skills">
                    <span className="tag tag-have">{t.skill_offered}</span>
                    <span style={{ color: 'var(--text3)' }}>taught to</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.receiver?.name}</span>
                  </div>
                  <div className="exchange-history-date">{formatDate(t.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills Learned */}
        <div className="section-card">
          <div className="section-card-title">📚 Skills Learned</div>
          {learned.length === 0 ? (
            <p style={{ color: 'var(--text3)', fontSize: '0.88rem' }}>No completed exchanges yet.</p>
          ) : (
            <div className="exchange-history-grid">
              {learned.map((t, i) => (
                <div key={i} className="exchange-history-item">
                  <div className="exchange-history-skills">
                    <span className="tag tag-want">{t.skill_requested}</span>
                    <span style={{ color: 'var(--text3)' }}>learned from</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.sender?.name}</span>
                  </div>
                  <div className="exchange-history-date">{formatDate(t.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ratings/Reviews */}
        {ratings.length > 0 && (
          <div className="section-card">
            <div className="section-card-title">⭐ Reviews</div>
            {ratings.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="review-name">{r.rater?.name}</div>
                  <div className="review-stars">
                    {[1,2,3,4,5].map((s) => <span key={s}>{s <= r.score ? '★' : '☆'}</span>)}
                  </div>
                </div>
                {r.review && <div className="review-text">"{r.review}"</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}