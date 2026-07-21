import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { ARTICLES } from '../data/articles';
import './Resources.css';

const CATEGORIES = ['All', 'Critical Thinking', 'Founder Guides', 'Startup Tools', 'AI & Learning'];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredArticles = activeCategory === 'All'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <main className="bg-noise" style={{ paddingBottom: '100px' }}>
      <section className="resources-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Knowledge Hub</span>
          </Reveal>
          <Reveal delay={0.08} as="h1">
            Insights & Operator Guides
          </Reveal>
          <Reveal delay={0.16} as="p">
            Deep-dives on mental systems, validation experiment templates, and software engineering practices.
          </Reveal>

          {/* Categories */}
          <Reveal delay={0.24}>
            <div className="filter-bar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid of Articles */}
      <section className="container">
        <div className="resources-grid">
          {filteredArticles.map((art, index) => (
            <Reveal key={art.slug} delay={index * 0.08} className="article-card hover-lift border-glow">
              <div className="article-card__media">
                {art.mediaText}
              </div>
              <div className="article-card__body">
                <div className="article-card__meta">
                  <span className="article-card__category">{art.category}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h3>{art.title}</h3>
                <p>{art.summary}</p>
                <Link to={`/resources/${art.slug}`} className="article-card__link">
                  Read article →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter signup block */}
      <section className="container">
        <Reveal className="newsletter-box">
          <h3>Stay ahead of the loop</h3>
          <p>
            Get our bi-weekly guides on critical thinking, startup scaling, and product validation. Zero spam, pure technical leverage.
          </p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
            <input type="email" required placeholder="Enter your email" aria-label="Email address" />
            <button type="submit" className="btn btn-fill">Subscribe</button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
