import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const LINKS = [
  { to: '/programs', label: 'Programs' },
  { to: '/for-hr', label: "For HR's" },
  { to: '/resources', label: 'Explore ACHL' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkUserSession = () => {
    const userStr = localStorage.getItem('achl_user');
    if (userStr) {
      try {
        JSON.parse(userStr);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserSession();
    // Listen for storage changes to handle login/logout across tabs/components
    window.addEventListener('storage', checkUserSession);
    return () => window.removeEventListener('storage', checkUserSession);
  }, [location.pathname]); // Re-check on page navigation

  const handleLogout = () => {
    localStorage.removeItem('achl_user');
    localStorage.removeItem('achl_token');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <motion.header
      className={`nav ${open ? 'nav--open' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav__inner container">
        <Link to="/" className="nav__brand" aria-label="ACHL home">
          <span className="logo-text">ACHL<span className="logo-cursor">_</span></span>
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav__login">Dashboard</Link>
              <button onClick={handleLogout} className="nav__logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="nav__login">Login</Link>
          )}
          <Link to="/programs" className="btn btn-accent nav__signup">Explore Programs</Link>
        </div>

        <button
          className="nav__burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="nav__mobile-inner container">
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className="nav__mobile-link">
                  {l.label}
                </NavLink>
              ))}
              <div className="nav__mobile-actions">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="nav__mobile-link-action">Dashboard</Link>
                    <button onClick={handleLogout} className="nav__mobile-logout">Logout</button>
                  </>
                ) : (
                  <Link to="/login" className="nav__mobile-link-action">Login</Link>
                )}
                <Link to="/programs" className="btn btn-accent">Explore Programs</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
