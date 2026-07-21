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
            <li><Link to="/for-startups">For Startups</Link></li>
            <li><Link to="/resources">Resources Hub</Link></li>
            <li><Link to="/about">About Us</Link></li>
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
