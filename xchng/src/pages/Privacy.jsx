import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly: your name, email address, and password on registration; skills you add to your profile; messages you send to other users; ratings and reviews you submit. We do not collect payment information, location data, or any third-party account data."
  },
  {
    title: "2. How We Use Your Information",
    content: "We use your information to: provide and operate the Xchng platform; match you with potential skill exchange partners; enable communication between users; display your profile to other users; improve the platform's functionality and user experience. We do not sell your personal information to third parties."
  },
  {
    title: "3. Data Storage",
    content: "Your data is stored securely in a PostgreSQL database hosted by Supabase. Passwords are never stored in plain text — they are hashed using the bcrypt algorithm before storage. We use industry-standard security practices to protect your data."
  },
  {
    title: "4. Data Sharing",
    content: "Your name, email, and skills are visible to other registered users of the platform as part of the core functionality. Your messages are visible only to you and the intended recipient. Your ratings and reviews are visible to other users. We do not share your data with advertisers or third-party marketers."
  },
  {
    title: "5. Cookies and Local Storage",
    content: "Xchng uses localStorage to store your authentication token on your device. This is necessary to keep you logged in between sessions. We do not use tracking cookies or advertising cookies."
  },
  {
    title: "6. Your Rights",
    content: "You have the right to: access your personal data through your profile page; update your information at any time; delete your account and all associated data permanently from your profile settings. Upon account deletion, all your data including profile, messages, requests, and ratings will be permanently removed."
  },
  {
    title: "7. Children's Privacy",
    content: "Xchng is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover such data has been collected, it will be deleted immediately."
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify users of significant changes. Continued use of the platform after changes constitutes acceptance of the updated policy."
  },
];

export default function Privacy() {
  return (
    <div className="page">
      <Navbar />
      <div className="page-inner" style={{ maxWidth: 760 }}>
        <div className="page-header">
          <h1 className="page-title">Privacy <span className="page-title-accent">Policy</span></h1>
          <p style={{ color: 'var(--text2)', marginTop: 8 }}>Last updated: January 2025</p>
        </div>
        <p style={{ color: 'var(--text2)', marginBottom: 32, lineHeight: 1.7 }}>
          This Privacy Policy explains how Xchng collects, uses, and protects your personal information.
        </p>
        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>{s.title}</h3>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{s.content}</p>
          </div>
        ))}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)', color: 'var(--text2)', fontSize: '0.9rem' }}>
          Questions about your data? Contact us through the platform. <Link to="/" style={{ color: 'var(--accent)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}