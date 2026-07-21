import Reveal from './Reveal';
import { Link } from 'react-router-dom';
import './PagePlaceholder.css';

export default function PagePlaceholder({ eyebrow, title, description, children }) {
  return (
    <main className="placeholder">
      <div className="container placeholder__inner">
        <Reveal><span className="eyebrow">{eyebrow}</span></Reveal>
        <Reveal delay={0.08} as="h1" className="placeholder__title">
          {title}
        </Reveal>
        <Reveal delay={0.16} as="p" className="placeholder__desc">
          {description}
        </Reveal>

        {children && (
          <Reveal delay={0.24} className="placeholder__body">
            {children}
          </Reveal>
        )}

        <Reveal delay={0.3} className="placeholder__back">
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </Reveal>
      </div>
    </main>
  );
}
