import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

export default function NotFound() {
  return (
    <main className="not-found bg-noise bg-grid">
      <div className="container not-found__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow not-found__badge">Error 404</span>
          <h1 className="not-found__title">
            Page <span>Not Found.</span>
          </h1>
          <p className="not-found__desc">
            The path you are looking for does not exist, has been moved, or is restricted to authorised operators.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="btn btn-fill">
              Return Home
            </Link>
            <Link to="/programs" className="btn btn-outline" style={{ color: '#F9F8F6', borderColor: 'rgba(255,255,255,0.2)' }}>
              Explore Programs
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
