import { Link } from 'react-router-dom';

export default function Navbar({ showAuth = true }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Xchng</Link>
      {showAuth && (
        <div className="navbar-links">
          <Link to="/login"><button className="nav-btn nav-btn-ghost">Login</button></Link>
          <Link to="/register"><button className="nav-btn nav-btn-solid">Register</button></Link>
        </div>
      )}
    </nav>
  );
}