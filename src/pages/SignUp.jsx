import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiRequest } from '../utils/api';
import './Auth.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Student');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const data = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
      });
      localStorage.setItem('achl_user', JSON.stringify(data.user));
      localStorage.setItem('achl_token', data.token);
      
      // Dispatch storage event to alert Navbar component
      window.dispatchEvent(new Event('storage'));
      
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <main className="auth bg-noise">
      <div className="auth__container">
        
        {/* Left Side: Brand Promo Panel */}
        <div className="auth__promo bg-grid">
          <div className="auth__promo-inner">
            <span className="eyebrow" style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.08)', borderColor: 'rgba(197, 0, 24, 0.2)' }}>
              ACHL Academic Registration
            </span>
            <h2>Build the skills AI cannot automate.</h2>
            <p>
              Join 12,000+ members studying first-principles, critical thinking, venture modeling, and clean software architecture.
            </p>
            
            <div className="auth__features">
              <div className="auth__feature-item">
                <span className="auth__feature-check">✓</span>
                <div>
                  <strong>First-Principles Reasoning</strong>
                  <p>Boil systems down to their basic physical truths.</p>
                </div>
              </div>
              <div className="auth__feature-item">
                <span className="auth__feature-check">✓</span>
                <div>
                  <strong>Hypothesis Testing</strong>
                  <p>Design landing page smoke tests and capture actual demand metrics.</p>
                </div>
              </div>
              <div className="auth__feature-item">
                <span className="auth__feature-check">✓</span>
                <div>
                  <strong>Active Peer Programs</strong>
                  <p>Submit and critique product schemas in live weekly syncs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="auth__form-panel">
          <motion.div
            className="auth__card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="logo-text" style={{ color: 'var(--black)', fontSize: '28px', marginBottom: '20px' }}>
              ACHL<span className="logo-cursor">_</span>
            </span>
            <h1>Create your account</h1>
            <p>Start building the one skill AI can't replace.</p>

            {errorMsg && (
              <div style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', padding: '10px 14px', borderRadius: '6px', fontSize: '13.5px', marginBottom: '16px', borderLeft: '3px solid var(--red)' }}>
                {errorMsg}
              </div>
            )}

            <form className="auth__form" onSubmit={handleSignUp}>
              <label>
                <span>Full name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <label>
                <span>Password</span>
                <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      width: 'auto',
                      marginTop: 0,
                      color: 'var(--grey)'
                    }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              <label>
                <span>I am joining as a...</span>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-soft)',
                    background: 'var(--white)',
                    color: 'var(--black)',
                  }}
                >
                  <option value="Student">Student / Graduate</option>
                  <option value="Aspiring Founder">Aspiring Founder</option>
                  <option value="Founder">Founder (first-time / active)</option>
                  <option value="Professional">Corporate Professional</option>
                </select>
              </label>
              <button type="submit" className="btn btn-fill" style={{ marginTop: '16px' }}>
                Register & Get Started
              </button>
            </form>

            <p className="auth__switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </motion.div>
        </div>

      </div>
    </main>
  );
}
