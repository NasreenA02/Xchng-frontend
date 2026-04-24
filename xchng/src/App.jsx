import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import BrowseUsers from './pages/BrowseUsers.jsx';
import Requests from './pages/Requests.jsx';
import Messages from './pages/Messages.jsx';
import Ratings from './pages/Ratings.jsx';
import PublicProfile from './pages/PublicProfile.jsx';
import Terms from './pages/Terms.jsx';
import Privacy from './pages/Privacy.jsx';



const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('xchng_token');
  return token ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/browse" element={<PrivateRoute><BrowseUsers /></PrivateRoute>} />
        <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
        <Route path="/ratings" element={<PrivateRoute><Ratings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/user/:id" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}