import { Link } from 'react-router-dom';
import './Footer.css';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer bg-noise">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="logo-text footer__logo-text">ACHL<span className="logo-cursor">_</span></span>
          <p className="footer__desc">
            Learn how to think, validate, decide, and build better. Building critical thinkers, first-time founders, and startup teams in the era of AI.
          </p>
        </div>

        <div className="footer__col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/for-hr">For HR's</Link></li>
            <li><Link to="/resources">Explore ACHL</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Connect & Address</h4>
          <ul className="footer__contact-list">
            <li><a href="https://www.instagram.com/achl.think" target="_blank" rel="noopener noreferrer">Instagram (@achl.think)</a></li>
            <li><a href="https://www.linkedin.com/in/achl-think-3237a13b5/" target="_blank" rel="noopener noreferrer">LinkedIn (ACHL)</a></li>
            <li style={{ color: 'var(--grey)', fontSize: '13px', lineHeight: '1.4', marginTop: '6px' }}>
              📍 Prahladnagar, Ahmedabad, Gujarat, 380015
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Support & Legal</h4>
          <ul>
            <li><Link to="/contact">Contact Support</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {YEAR} ACHL. Learn to think and build. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
