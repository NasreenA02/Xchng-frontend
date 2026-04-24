import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing or using Xchng, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our platform. These terms apply to all users of the platform."
  },
  {
    title: "2. User Accounts",
    content: "You must provide accurate information when creating your account. You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately of any unauthorized use of your account. You must be at least 13 years of age to use Xchng."
  },
  {
    title: "3. Skill Exchange",
    content: "Xchng facilitates peer-to-peer skill exchange between users. We do not guarantee the quality, accuracy, or reliability of any skill exchange. All exchanges are conducted at users' own risk. Xchng is not a party to any exchange agreement between users."
  },
  {
    title: "4. Prohibited Conduct",
    content: "Users may not: share false or misleading information about their skills; harass, threaten, or intimidate other users; use the platform for any illegal purpose; attempt to access other users' accounts; spam or send unsolicited messages; share offensive or harmful content through the messaging system."
  },
  {
    title: "5. Content",
    content: "Users retain ownership of content they submit to the platform. By submitting content, you grant Xchng a non-exclusive license to use, display, and distribute that content on the platform. You are solely responsible for all content you submit."
  },
  {
    title: "6. Termination",
    content: "We reserve the right to suspend or terminate accounts that violate these terms. Users may delete their own account at any time from their profile settings. Upon termination, all associated data will be permanently deleted."
  },
  {
    title: "7. Disclaimer of Warranties",
    content: "Xchng is provided 'as is' without any warranties of any kind. We do not guarantee that the platform will be uninterrupted, error-free, or free of harmful components. We are not responsible for any outcomes resulting from skill exchanges between users."
  },
  {
    title: "8. Changes to Terms",
    content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes where possible."
  },
];

export default function Terms() {
  return (
    <div className="page">
      <Navbar />
      <div className="page-inner" style={{ maxWidth: 760 }}>
        <div className="page-header">
          <h1 className="page-title">Terms & <span className="page-title-accent">Conditions</span></h1>
          <p style={{ color: 'var(--text2)', marginTop: 8 }}>Last updated: January 2025</p>
        </div>
        <p style={{ color: 'var(--text2)', marginBottom: 32, lineHeight: 1.7 }}>
          Please read these Terms and Conditions carefully before using the Xchng Skill Exchange Platform.
        </p>
        {sections.map((s) => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>{s.title}</h3>
            <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.95rem' }}>{s.content}</p>
          </div>
        ))}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)', color: 'var(--text2)', fontSize: '0.9rem' }}>
          Questions about these terms? Contact us through the platform. <Link to="/" style={{ color: 'var(--accent)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}