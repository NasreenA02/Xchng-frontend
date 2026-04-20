import { useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';

const cards = [
  { icon: '👤', title: 'Edit Profile', desc: 'Update your skills and personal info.', path: '/profile' },
  { icon: '🌐', title: 'Browse Users', desc: 'Explore people and their skills.', path: '/browse' },
  { icon: '📬', title: 'My Requests', desc: 'View sent and received skill requests.', path: '/requests' },
  { icon: '💬', title: 'Messages', desc: 'Chat with your skill exchange partners.', path: '/messages' },
  { icon: '⭐', title: 'My Ratings', desc: 'See reviews you have received.', path: '/ratings' },
];
export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner">
        <div className="dash-greeting">
          Hey, <span>{user?.name?.split(' ')[0] || 'there'}</span> 👋
        </div>
        <p className="dash-sub">What would you like to do today?</p>

        <div className="dash-grid">
          {cards.map((c) => (
            <div key={c.path} className="dash-card" onClick={() => navigate(c.path)}>
              <div className="dash-card-icon">{c.icon}</div>
              <div className="dash-card-title">{c.title}</div>
              <div className="dash-card-desc">{c.desc}</div>
            </div>
          ))}
          <div className="dash-card dash-card-logout" onClick={logout}>
            <div className="dash-card-icon">🚪</div>
            <div className="dash-card-title">Logout</div>
            <div className="dash-card-desc">Sign out of your account safely.</div>
          </div>
        </div>
      </div>
    </div>
  );
}