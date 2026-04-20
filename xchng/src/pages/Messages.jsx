import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getUser } from '../api/client.js';
import Navbar from '../components/Navbar.jsx';

export default function Messages() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.other_user.id);
      // Poll every 4 seconds for new messages
      pollRef.current = setInterval(() => loadMessages(activeConv.other_user.id), 4000);
    }
    return () => clearInterval(pollRef.current);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await api.get('/conversations');
      setConversations(data);
    } catch {}
    finally { setLoading(false); }
  };

  const loadMessages = async (otherId) => {
    try {
      const data = await api.get(`/messages/${otherId}`);
      setMessages(data);
      // Refresh unread counts
      loadConversations();
    } catch {}
  };

  const openConversation = (conv) => {
    setActiveConv(conv);
    setMessages([]);
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await api.post('/messages', {
        receiver_id: activeConv.other_user.id,
        content: input.trim(),
      });
      setInput('');
      loadMessages(activeConv.other_user.id);
    } catch {}
    finally { setSending(false); }
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page">
      <Navbar showAuth={false} />
      <div className="page-inner" style={{ maxWidth: 900 }}>
        <div className="page-back" onClick={() => navigate('/dashboard')}>← Back to Dashboard</div>
        <div className="page-header">
          <h1 className="page-title">
            {activeConv
              ? <><span className="page-back" onClick={() => { setActiveConv(null); clearInterval(pollRef.current); }}>←</span> {activeConv.other_user.name}</>
              : <>My <span className="page-title-accent">Messages</span></>}
          </h1>
        </div>

        {/* Conversations List */}
        {!activeConv && (
          loading ? (
            <div className="loading-screen"><span className="spinner" /><p>Loading conversations…</p></div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p>No conversations yet. Accept a skill exchange request to start chatting.</p>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conv) => (
                <div key={conv.request_id} className="conversation-card" onClick={() => openConversation(conv)}>
                  <div className="conv-avatar">{conv.other_user.name.charAt(0).toUpperCase()}</div>
                  <div className="conv-info">
                    <div className="conv-name">{conv.other_user.name}</div>
                    <div className="conv-last-msg">
                      {conv.last_message ? conv.last_message.content : 'No messages yet — say hi!'}
                    </div>
                    <div className="conv-skill-tag">
                      {conv.skill_offered} ⇄ {conv.skill_requested}
                    </div>
                  </div>
                  <div className="conv-meta">
                    {conv.unread_count > 0 && (
                      <span className="unread-badge">{conv.unread_count}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Chat Window */}
        {activeConv && (
          <div className="chat-window">
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="empty-state" style={{ padding: '32px 0' }}>
                  <div className="empty-state-icon">👋</div>
                  <p>Start the conversation!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div className={`message-bubble ${msg.sender_id === currentUser.id ? 'mine' : 'theirs'}`}>
                    {msg.content}
                    <div className="message-time">{formatTime(msg.created_at)}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-row">
              <input
                className="chat-input"
                placeholder="Type a message…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button className="chat-send-btn" onClick={send} disabled={sending || !input.trim()}>
                {sending ? '…' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}