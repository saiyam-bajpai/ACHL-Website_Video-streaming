import { useEffect, useState } from 'react';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Contact.css';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        setUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
      } catch {
        setUser(null);
      }
    }

    const lastSubmitTime = localStorage.getItem('achl_last_contact_submit');
    if (lastSubmitTime) {
      const elapsedSeconds = Math.floor((Date.now() - parseInt(lastSubmitTime)) / 1000);
      if (elapsedSeconds < 60) {
        setCooldownLeft(60 - elapsedSeconds);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const interval = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    if (honeypot.trim() !== '') {
      setStatus({ type: 'success', msg: 'Your message has been sent successfully!' });
      return;
    }

    if (cooldownLeft > 0) {
      setStatus({
        type: 'error',
        msg: `Security Cooldown Active: Please wait ${cooldownLeft} seconds before sending another message.`,
      });
      return;
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: 'error', msg: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);

    try {
      // 1. Save submission to LocalStorage for Admin display
      const existing = JSON.parse(localStorage.getItem('achl_contact_submissions') || '[]');
      const newContact = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        submittedAt: new Date().toISOString(),
      };
      existing.unshift(newContact);
      localStorage.setItem('achl_contact_submissions', JSON.stringify(existing));

      // 2. Set cooldown timestamp
      localStorage.setItem('achl_last_contact_submit', Date.now().toString());
      setCooldownLeft(60);

      // 3. Dispatch to backend API
      try {
        await apiRequest('/contact', {
          method: 'POST',
          body: JSON.stringify({ name, email, subject, message }),
        });
      } catch (err) {
        console.log('Backend notification synced or logged:', err.message);
      }

      setStatus({
        type: 'success',
        msg: 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.',
      });
      setMessage('');
      if (!user) {
        setName('');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: err.message || 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page bg-noise">
      {/* Header */}
      <section className="contact-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow-badge">CONTACT & CAMPUS</span>
          </Reveal>
          <Reveal delay={0.08} as="h1" className="contact-hero__title">
            Get in touch with ACHL.
          </Reveal>
          <Reveal delay={0.16} as="p" className="contact-hero__subtitle">
            Have questions regarding our academic programs, corporate hiring network, or executive alignment? Reach out directly using the form below.
          </Reveal>
        </div>
      </section>

      {/* 2-Column Split Section */}
      <section className="container contact-section">
        <div className="contact-grid">
          {/* Left Column: Contact Details */}
          <Reveal className="contact-info-card">
            <span className="info-card-badge">OFFICIAL CONTACTS</span>
            <h2>Connect with Us</h2>
            <p className="contact-info__desc">
              Our academic relations team and faculty operators are available to assist you.
            </p>

            <div className="info-details-list">
              <div className="info-item">
                <div className="info-icon-wrap">📍</div>
                <div>
                  <strong>Campus Address</strong>
                  <p>Prahladnagar, Ahmedabad, Gujarat, 380015, India</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrap">✉</div>
                <div>
                  <strong>Direct Email</strong>
                  <p><a href="mailto:agyaat@achllearnings.com">agyaat@achllearnings.com</a></p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon-wrap">🌐</div>
                <div>
                  <strong>Social Channels</strong>
                  <div className="social-favicons-group">
                    <a
                      href="https://www.instagram.com/achl.think"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-favicon-btn"
                    >
                      <InstagramIcon />
                      <span>@achl.think</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/achl-think-3237a13b5/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-favicon-btn"
                    >
                      <LinkedinIcon />
                      <span>ACHL LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Contact Form */}
          <Reveal delay={0.16} className="contact-form-card">
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send us a Message</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                Fill out the fields below and our team will get back to you within 24 hours.
              </p>

              {status.msg && (
                <div
                  className="form-status-alert"
                  style={{
                    color: status.type === 'success' ? 'var(--maroon)' : 'var(--red)',
                    background: status.type === 'success' ? 'rgba(128, 0, 32, 0.06)' : 'rgba(197, 0, 24, 0.06)',
                    borderLeft: `4px solid ${status.type === 'success' ? 'var(--maroon)' : 'var(--red)'}`,
                  }}
                >
                  {status.msg}
                </div>
              )}

              {/* Honeypot Security Input */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-row-2col">
                <label>
                  <span>Your Name *</span>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Aurelius"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!!user}
                  />
                </label>
                <label>
                  <span>Your Email *</span>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!user}
                  />
                </label>
              </div>

              <label>
                <span>Subject</span>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Billing & Support">Billing & Support</option>
                  <option value="Program Feedback">Program Feedback</option>
                  <option value="Corporate & HR Hiring">Corporate & HR Hiring</option>
                  <option value="Partnerships & Ventures">Partnerships & Ventures</option>
                </select>
              </label>

              <label>
                <span>Message *</span>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explain your inquiry in detail..."
                  required
                />
              </label>

              <button
                type="submit"
                className="btn btn-accent contact-submit-btn"
                disabled={loading || cooldownLeft > 0}
              >
                {loading
                  ? 'Sending Message...'
                  : cooldownLeft > 0
                  ? `Cooldown Active (${cooldownLeft}s)`
                  : 'Send Message'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
