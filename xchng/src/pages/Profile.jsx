import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuth, getUser } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';
import Alert from '../components/Alert.jsx';

export default function Profile() {
  const [completed, setCompleted] = useState({ taught: [], learned: [], total: 0 });
  const navigate = useNavigate();
  const user = getUser();
  const [skillsHave, setSkillsHave] = useState([]);
  const [skillsWant, setSkillsWant] = useState([]);
  const [inputHave, setInputHave] = useState('');
  const [inputWant, setInputWant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get('/profile/completed').then(setCompleted).catch(() => {});
    api.get('/profile').then((data) => {
      setSkillsHave(data.skills_have || []);
      setSkillsWant(data.skills_want || []);
    }).catch(() => {});
  }, []);

  const addSkill = (list, setList, input, setInput) => {
    const val = input.trim();
    if (val && !list.includes(val)) setList([...list, val]);
    setInput('');
  };

  const removeSkill = (list, setList, skill) => setList(list.filter((s) => s !== skill));

  const save = async () => {
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const data = await api.put('/profile', { skills_have: skillsHave, skills_want: skillsWant });
      const stored = getUser();
      setAuth(localStorage.getItem('xchng_token'), { ...stored, ...data.user });
      setSuccess('Profile saved!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="page-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</div>
        <div className="page-header">
          <h1 className="page-title">My <span className="page-title-accent">Profile</span></h1>
        </div>

        <div className="profile-meta">
          <div className="profile-name">{user?.name}</div>
          <div className="profile-email">{user?.email}</div>
        </div>

        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>

        {/* Skills Have */}
        <div className="skills-section">
          <div className="skills-section-title">🟣 Skills I Have</div>
          <div className="skills-input-row">
            <input
              className="form-input"
              placeholder="e.g. Python, Guitar, Cooking…"
              value={inputHave}
              onChange={(e) => setInputHave(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillsHave, setSkillsHave, inputHave, setInputHave))}
            />
            <button className="btn btn-secondary btn-sm" onClick={() => addSkill(skillsHave, setSkillsHave, inputHave, setInputHave)}>Add</button>
          </div>
          <div className="tag-list">
            {skillsHave.map((s) => (
              <span key={s} className="skill-chip tag-have">
                {s} <span className="skill-chip-remove" onClick={() => removeSkill(skillsHave, setSkillsHave, s)}>×</span>
              </span>
            ))}
          </div>
        </div>

        {/* Skills Want */}
        <div className="skills-section">
          <div className="skills-section-title">🩷 Skills I Want</div>
          <div className="skills-input-row">
            <input
              className="form-input"
              placeholder="e.g. React, Spanish, Photography…"
              value={inputWant}
              onChange={(e) => setInputWant(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillsWant, setSkillsWant, inputWant, setInputWant))}
            />
            <button className="btn btn-secondary btn-sm" onClick={() => addSkill(skillsWant, setSkillsWant, inputWant, setInputWant)}>Add</button>
          </div>
          <div className="tag-list">
            {skillsWant.map((s) => (
              <span key={s} className="skill-chip tag-want">
                {s} <span className="skill-chip-remove" onClick={() => removeSkill(skillsWant, setSkillsWant, s)}>×</span>
              </span>
            ))}
          </div>
        </div>
          <div className="profile-stats-row" style={{ marginTop: 32 }}>
  <div className="profile-stat-card">
    <div className="profile-stat-number">{completed.taught.length}</div>
    <div className="profile-stat-label">Skills Taught</div>
  </div>
  <div className="profile-stat-card">
    <div className="profile-stat-number">{completed.learned.length}</div>
    <div className="profile-stat-label">Skills Learned</div>
  </div>
  <div className="profile-stat-card">
    <div className="profile-stat-number">{completed.total}</div>
    <div className="profile-stat-label">Total Exchanges</div>
  </div>
</div>

{completed.taught.length > 0 && (
  <div className="section-card">
    <div className="section-card-title">✅ Skills I've Taught</div>
    <div className="exchange-history-grid">
      {completed.taught.map((t, i) => (
        <div key={i} className="exchange-history-item">
          <div className="exchange-history-skills">
            <span className="tag tag-have">{t.skill_offered}</span>
            <span style={{ color: 'var(--text3)' }}>taught to</span>
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.receiver?.name}</span>
          </div>
          <div className="exchange-history-date">
            {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{completed.learned.length > 0 && (
  <div className="section-card">
    <div className="section-card-title">📚 Skills I've Learned</div>
    <div className="exchange-history-grid">
      {completed.learned.map((t, i) => (
        <div key={i} className="exchange-history-item">
          <div className="exchange-history-skills">
            <span className="tag tag-want">{t.skill_requested}</span>
            <span style={{ color: 'var(--text3)' }}>learned from</span>
            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.sender?.name}</span>
          </div>
          <div className="exchange-history-date">
            {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        <button className="btn btn-primary" style={{ maxWidth: 240 }} onClick={save} disabled={loading}>
          {loading ? <><span className="spinner" /> Saving…</> : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}