import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PagePlaceholder from '../components/PagePlaceholder';
import { apiRequest } from '../utils/api';
import './Contact.css';

export default function Contact() {
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setStatus({ type: '', msg: '' });
    setLoading(true);

    try {
      await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          subject,
          message
        })
      });
      setStatus({ type: 'success', msg: 'Your message has been sent successfully. We will get back to you soon!' });
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="contact bg-noise" style={{ padding: '120px 0', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--white)', border: '1.5px solid var(--border-soft)', padding: '48px', borderRadius: '16px' }}>
          <span className="eyebrow" style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>Members Only</span>
          <h2 style={{ fontSize: '32px', marginTop: '16px', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Contact Faculty</h2>
          <p style={{ color: 'var(--grey)', marginBottom: '32px', lineHeight: '1.6' }}>
            To prevent spam and ensure high-quality responses, only registered learners can send inquiries directly to our operators.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-fill">Login</Link>
            <Link to="/signup" className="btn btn-outline" style={{ color: 'var(--black)', borderColor: 'var(--border-soft)' }}>Create Account</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PagePlaceholder
      eyebrow="Contact"
      title="Let's talk."
      description="Questions about the programs, billing, or technical execution? Send a direct note below. Form requests are rate-limited to ensure quality feedback."
    >
      <form className="contact-form" onSubmit={handleSubmit} style={{ background: 'var(--white)', border: '1.5px solid var(--border-soft)', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '640px', margin: '0 auto', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        {status.msg && (
          <div style={{
            color: status.type === 'success' ? 'var(--maroon)' : 'var(--red)',
            background: status.type === 'success' ? 'rgba(128, 0, 32, 0.05)' : 'rgba(197, 0, 24, 0.05)',
            padding: '14px',
            borderRadius: '8px',
            fontSize: '14px',
            marginBottom: '24px',
            borderLeft: `4px solid ${status.type === 'success' ? 'var(--maroon)' : 'var(--red)'}`,
            textAlign: 'left'
          }}>
            {status.msg}
          </div>
        )}

        <div className="contact-form__row" style={{ marginBottom: '16px' }}>
          <label>
            <span>Your Name</span>
            <input type="text" value={user.name} disabled style={{ background: 'var(--cream)', color: 'var(--grey)', cursor: 'not-allowed' }} />
          </label>
          <label>
            <span>Your Email</span>
            <input type="email" value={user.email} disabled style={{ background: 'var(--cream)', color: 'var(--grey)', cursor: 'not-allowed' }} />
          </label>
        </div>

        <label style={{ display: 'block', marginBottom: '16px' }}>
          <span>Subject</span>
          <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-soft)', background: 'var(--white)', color: 'var(--black)', fontFamily: 'inherit', fontSize: '15px' }}>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Billing & Support">Billing & Support</option>
            <option value="Program Feedback">Program Feedback</option>
            <option value="Partnerships & Ventures">Partnerships & Ventures</option>
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: '16px' }}>
          <span>Message</span>
          <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Explain your inquiry in detail..." required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-soft)', background: 'var(--white)', color: 'var(--black)', fontFamily: 'inherit', fontSize: '15px' }} />
        </label>

        <button type="submit" className="btn btn-fill" disabled={loading} style={{ marginTop: '24px', width: '100%', padding: '14px 28px', fontSize: '16px', fontWeight: 'bold' }}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </PagePlaceholder>
  );
}
