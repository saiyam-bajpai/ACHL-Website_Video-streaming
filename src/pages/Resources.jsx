import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { ARTICLES } from '../data/articles';
import './Resources.css';

const CATEGORIES = ['All', 'Critical Thinking', 'Socratic Questioning', 'Mental Models', 'Decision Systems'];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = ARTICLES.filter((art) => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory || (activeCategory === 'Socratic Questioning' && art.slug.includes('socratic')) || (activeCategory === 'Mental Models' && art.slug.includes('first-principles')) || (activeCategory === 'Decision Systems' && art.slug.includes('cognitive'));
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="resources-page bg-noise">
      {/* Hero Section */}
      <section className="resources-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow-badge">EXPLORE ACHL BLOG & INSIGHTS</span>
          </Reveal>
          <Reveal delay={0.08} as="h1" className="resources-hero__title">
            Critical Thinking & Mental Systems Blog
          </Reveal>
          <Reveal delay={0.16} as="p" className="resources-hero__subtitle">
            Explore deep-dives, Socratic frameworks, and cognitive tools designed to help you deconstruct complex problems and build first-principles leverage.
          </Reveal>

          {/* Search & Categories Bar */}
          <Reveal delay={0.24}>
            <div className="blog-controls-wrapper">
              <div className="blog-search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search articles on critical thinking, mental models, biases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-bar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid of Critical Thinking Blog Posts */}
      <section className="container blog-articles-sec">
        {filteredArticles.length === 0 ? (
          <div className="no-articles-msg">
            <h3>No articles found matching "{searchQuery}"</h3>
            <p>Try searching for terms like "critical thinking", "Socratic", or "first principles".</p>
          </div>
        ) : (
          <div className="resources-grid">
            {filteredArticles.map((art, index) => (
              <Reveal key={art.slug} delay={index * 0.08} className="article-card hover-lift">
                <div className="article-card__media">
                  <span className="article-card__media-badge">{art.category}</span>
                  {art.mediaText}
                </div>
                <div className="article-card__body">
                  <div className="article-card__meta">
                    <span className="article-card__author">By {art.author}</span>
                    <span>•</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3>{art.title}</h3>
                  <p>{art.summary}</p>
                  <Link to={`/resources/${art.slug}`} className="article-card__link">
                    Read full blog post →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter signup block */}
      <section className="container">
        <Reveal className="newsletter-box">
          <h3>Subscribe to ACHL Thinking Digest</h3>
          <p>
            Get our bi-weekly deep-dives on critical thinking frameworks, cognitive bias audits, and strategic problem solving delivered straight to your inbox.
          </p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed to ACHL Digest successfully!'); }}>
            <input type="email" required placeholder="Enter your work or student email" aria-label="Email address" />
            <button type="submit" className="btn btn-accent">Subscribe</button>
          </form>
        </Reveal>
      </section>
    </main>
  );
}
