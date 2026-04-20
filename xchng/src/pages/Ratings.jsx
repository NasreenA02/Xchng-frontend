import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, getUser } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';
import Alert from '../components/Alert.jsx';

const Stars = ({ value, onChange }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        className={`star ${s <= value ? 'filled' : ''}`}
        onClick={() => onChange && onChange(s)}
      >★</span>
    ))}
  </div>
);

export default function Ratings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = getUser();

  // If ?request_id=xxx is in URL, show rating form
  const requestId = searchParams.get('request_id');
  const ratedName = searchParams.get('name');

  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // My ratings received
  const [myRatings, setMyRatings] = useState([]);
  const [avg, setAvg] = useState(null);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    api.get(`/ratings/${currentUser.id}`).then((data) => {
      setMyRatings(data.ratings);
      setAvg(data.average);
    }).catch(() => {}).finally(() => setRatingsLoading(false));
  }, []);

  const submitRating = async () => {
    if (score === 0) return setError('Please select a star rating.');
    setError(''); setSubmitLoading(true);
    try {
      await api.post('/rating', { request_id: requestId, score, review });
      setSuccess('Rating submitted! Thank you.');
      setTimeout(() => navigate('/requests'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="page-back" onClick={() => navigate(requestId ? '/requests' : '/dashboard')}>
          ← Back
        </div>

        {/* Rating Form (when coming from requests page) */}
        {requestId && (
          <div style={{ maxWidth: 480, marginBottom: 48 }}>
            <div className="page-header">
              <h1 className="page-title">Rate <span className="page-title-accent">{ratedName}</span></h1>
            </div>
            <p style={{ color: 'var(--text2)', marginBottom: 24 }}>
              How was your skill exchange experience?
            </p>
            <Alert type="error">{error}</Alert>
            <Alert type="success">{success}</Alert>
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <Stars value={score} onChange={setScore} />
            </div>
            <div className="form-group">
              <label className="form-label">Review (optional)</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Share your experience with this exchange…"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                style={{ borderRadius: 12, resize: 'vertical' }}
              />
            </div>
            <button className="btn btn-primary" style={{ maxWidth: 220 }} onClick={submitRating} disabled={submitLoading}>
              {submitLoading ? <><span className="spinner" /> Submitting…</> : 'Submit Rating'}
            </button>
          </div>
        )}

        {/* My Ratings Received */}
        <div className="page-header">
          <h1 className="page-title">My <span className="page-title-accent">Ratings</span></h1>
        </div>

        {ratingsLoading ? (
          <div className="loading-screen"><span className="spinner" /></div>
        ) : myRatings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⭐</div>
            <p>No ratings yet. Complete a skill exchange to get rated.</p>
          </div>
        ) : (
          <>
            <div className="avg-rating">
              <div className="avg-score">{avg}</div>
              <div>
                <Stars value={Math.round(avg)} />
                <div className="avg-label">{myRatings.length} review{myRatings.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
            {myRatings.map((r) => (
              <div key={r.id} className="rating-card">
                <div className="rating-header">
                  <div className="rating-name">{r.rater?.name}</div>
                  <div className="rating-stars">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className="rating-star">{s <= r.score ? '★' : '☆'}</span>
                    ))}
                  </div>
                </div>
                {r.review && <div className="rating-review">"{r.review}"</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}