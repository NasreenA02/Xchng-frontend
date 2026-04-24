import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import '../styles/home.css';

const features = [
  { icon: '🔄', title: 'Skill Swapping', desc: 'Exchange your expertise for skills you want to learn. No money needed — just knowledge.' },
  { icon: '🌍', title: 'Global Community', desc: 'Connect with learners and experts across the world on any topic imaginable.' },
  { icon: '🤝', title: 'Direct Requests', desc: 'Send tailored exchange requests to specific people with matching skills.' },
  { icon: '⚡', title: 'Instant Matching', desc: 'Browse profiles and find people whose skills align perfectly with your goals.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'JWT-based auth keeps your account safe. Only you control your data.' },
  { icon: '✨', title: 'Free Forever', desc: 'No subscriptions, no fees. Skill exchange the way it should be — free.' },
];

export default function Home() {
  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-inner">
          <div className="hero-badge">✦ The Skill Economy</div>
          <h1 className="hero-title">
            Trade What You Know<br />
            <span className="hero-title-gradient">Learn What You Love</span>
          </h1>
          <p className="hero-desc">
            Xchng connects people who want to exchange skills. Teach what you're great at,
            learn what excites you — no money, just mutual growth.
          </p>
          <div className="hero-cta">
            <Link to="/register"><button className="btn-hero-primary">Get Started Free →</button></Link>
            <Link to="/login"><button className="btn-hero-secondary">Sign In</button></Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>100%</span><p>Free to use</p></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>∞</span><p>Skills to swap</p></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><span>2-way</span><p>Exchange model</p></div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-inner">
          <div className="section-header">
            <h2 className="section-title">Why <span className="page-title-accent">Xchng?</span></h2>
            <p className="section-sub">Everything you need for seamless skill exchange in one platform.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to start exchanging?</h2>
          <p className="cta-sub">Join learners and experts already on Xchng.</p>
          <Link to="/register"><button className="btn-hero-primary">Create Your Account</button></Link>
        </div>
      </section>

      <footer className="footer">
         <div className="footer-logo">Xchng</div>
  <p className="footer-text">© 2025 Xchng. Built for the curious.</p>
  <div style={{ marginTop: 12, display: 'flex', gap: 20, justifyContent: 'center' }}>
    <Link to="/terms" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Terms & Conditions</Link>
    <Link to="/privacy" style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Privacy Policy</Link>
  </div>
      </footer>
    </div>
  );
}