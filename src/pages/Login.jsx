import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiRequest } from '../utils/api';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      localStorage.setItem('achl_user', JSON.stringify(data.user));
      localStorage.setItem('achl_token', data.token);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err) {
      console.error('[Login Failure Details]', err);
      setErrorMsg(err.message || 'Invalid email or password.');
    }
  };

  return (
    <main className="auth bg-noise">
      <div className="auth__container">
        
        {/* Left Side: Brand Promo Panel */}
        <div className="auth__promo bg-grid">
          <div className="auth__promo-inner">
            <span className="eyebrow" style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.08)', borderColor: 'rgba(197, 0, 24, 0.2)' }}>
              ACHL Academic Portal
            </span>
            <h2>Learn the skill that AI cannot replicate.</h2>
            <p>
              Master critical thinking, startup validation, and software architecture with veteran industry operators.
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
            <h1>Welcome back</h1>
            <p>Log in to continue your thinking journey.</p>

            {errorMsg && (
              <div style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', padding: '10px 14px', borderRadius: '6px', fontSize: '13.5px', marginBottom: '16px', borderLeft: '3px solid var(--red)' }}>
                {errorMsg}
              </div>
            )}

            <form className="auth__form" onSubmit={handleLogin}>
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
              <button type="submit" className="btn btn-fill" style={{ marginTop: '16px' }}>
                Login
              </button>
            </form>

            <p className="auth__switch">
              New to ACHL? <Link to="/signup">Create an account</Link>
            </p>
          </motion.div>
        </div>

      </div>
    </main>
  );
}
