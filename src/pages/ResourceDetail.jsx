import { useParams, Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { ARTICLES } from '../data/articles';
import './Resources.css';

export default function ResourceDetail() {
  const { slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <main className="container" style={{ padding: '160px 20px', textAlignment: 'center' }}>
        <h2>Article not found</h2>
        <Link to="/resources" className="btn btn-outline" style={{ marginTop: '20px' }}>
          Back to Resources
        </Link>
      </main>
    );
  }

  return (
    <main className="article-reader bg-noise">
      <div className="container">
        {/* Header */}
        <Reveal className="article-reader__header">
          <Link to="/resources" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px', marginBottom: '24px' }}>
            ← Back to Resources
          </Link>
          <div className="article-card__meta" style={{ justifyContent: 'center' }}>
            <span className="article-card__category">{article.category}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <h1>{article.title}</h1>
          <div className="article-reader__meta">
            <span>By <strong>{article.author}</strong></span>
            <span>•</span>
            <span>Published <strong>{article.date}</strong></span>
          </div>
        </Reveal>

        {/* Media banner */}
        <Reveal delay={0.08} className="article-reader__banner">
          {article.mediaText}
        </Reveal>

        {/* Content */}
        <Reveal delay={0.16} className="article-reader__content">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </Reveal>

        {/* Newsletter Box */}
        <Reveal delay={0.24} className="newsletter-box">
          <h3>Enjoyed this piece?</h3>
          <p>
            Join 12,000+ engineers and operators receiving our bi-weekly guides on critical reasoning and venture building.
          </p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
            <input type="email" required placeholder="Enter your email" aria-label="Email address" />
            <button type="submit" className="btn btn-fill">Subscribe</button>
          </form>
        </Reveal>
      </div>
    </main>
  );
}
