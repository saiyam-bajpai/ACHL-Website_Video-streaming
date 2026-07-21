import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Classroom() {
  const { sessionId: _sessionId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatText, setChatText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Prof. Evelyn Vance', msg: 'Welcome everyone! Today we are discussing the semantics of framing problems.', isHost: true },
    { user: 'Arthur Pendelton', msg: 'Should we prioritize structural boundaries or customer persona interviews first?' },
    { user: 'Marcus Chen', msg: 'Boundaries first. You must understand the physics of the system before optimizing the user flow.', isHost: true },
    { user: 'Clara Oswald', msg: 'I shared my canvas in the program discord, would love some feedback on module 2.' },
  ]);

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [navigate]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatText.trim() || !user) return;
    
    setChatMessages([
      ...chatMessages,
      { user: user.name, msg: chatText, isHost: false }
    ]);
    setChatText('');
  };

  if (!user) return null;

  return (
    <main className="classroom bg-noise">
      {/* Header */}
      <div className="classroom-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" className="btn btn-outline" style={{ color: '#F9F8F6', borderColor: 'rgba(255,255,255,0.2)', padding: '6px 12px', fontSize: '12.5px' }}>
            ← Exit Classroom
          </Link>
          <h1>Semantics of Problem Framing — Program Seminar</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13.5px', color: 'rgba(249, 248, 246, 0.6)' }}>
          <span style={{ width: '8px', height: '8px', background: 'red', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.2s infinite step-end' }} />
          <span>RECORDING LIVE</span>
          <span>•</span>
          <strong style={{ color: 'var(--lime)' }}>48 Attendees</strong>
        </div>
      </div>

      {/* Classroom Workspace */}
      <div className="classroom-grid">
        {/* Presentation & Watermark */}
        <div className="classroom-main">
          <div className="classroom-video-area">
            {/* Confidential Student Watermark */}
            <div className="classroom-watermark">
              CONFIDENTIAL // {user.email} // IP: 192.168.42.100 // ACHL ACADEMY
            </div>

            {/* Presentation Slide Mock */}
            <div style={{ textAlign: 'center', zIndex: 2 }}>
              <span className="eyebrow" style={{ color: 'var(--lime)', borderColor: 'rgba(190, 243, 44, 0.3)', background: 'rgba(0,0,0,0.4)', marginBottom: '16px' }}>
                Active Slide
              </span>
              <h2 style={{ color: '#F9F8F6', fontSize: '28px', maxWidth: '500px', margin: '0 auto 16px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600 }}>
                "If I had an hour to solve a problem, I\'d spend 55 minutes thinking about the problem and 5 minutes thinking about solutions."
              </h2>
              <p style={{ color: 'var(--lime)', fontWeight: 600, fontSize: '14.5px' }}>
                — Albert Einstein (First-Principles Pedagogy)
              </p>
            </div>

            {/* Host video overlay */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              width: '120px',
              height: '90px',
              background: '#222',
              borderRadius: '8px',
              border: '1px solid var(--lime)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 'bold',
              color: 'var(--lime)'
            }}>
              [ HOST CAMERA ]
            </div>
          </div>

          {/* Shared Class Files bar */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>📁 Shared Seminar Canvas: <strong>Problem_Framing_v1.pdf</strong></span>
            <button onClick={() => alert('File downloaded!')} className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Download PDF
            </button>
          </div>
        </div>

        {/* Live Chat sidebar */}
        <div className="classroom-sidebar">
          <div className="classroom-chat-logs">
            <h3 style={{ fontSize: '15px', color: '#F9F8F6', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px', marginBottom: '8px' }}>
              Live Seminar Chat
            </h3>
            {chatMessages.map((msg, idx) => (
              <div key={idx} className="chat-msg">
                <strong style={{ color: msg.isHost ? 'var(--lime)' : 'var(--indigo)' }}>
                  {msg.user} {msg.isHost ? '★' : ''}
                </strong>
                <p>{msg.msg}</p>
              </div>
            ))}
          </div>

          <div className="classroom-chat-input-area">
            <form onSubmit={handleSendChat}>
              <input
                type="text"
                className="classroom-chat-input"
                placeholder="Type your message..."
                value={chatText}
                onChange={e => setChatText(e.target.value)}
              />
              <button type="submit" className="btn btn-accent" style={{ padding: '8px 14px', borderRadius: '6px', fontSize: '13px' }}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
