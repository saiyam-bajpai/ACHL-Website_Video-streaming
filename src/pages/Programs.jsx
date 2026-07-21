import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Programs.css';

const CATEGORIES = ['All', 'Critical Thinking', 'Entrepreneurship', 'Startup Building', 'AI & Modern Skills'];

export default function Programs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [coursesList, setCoursesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/courses');
      setCoursesList(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (slug) => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/signup');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      await apiRequest('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, courseSlug: slug })
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Enrollment error:', err);
    }
  };

  if (loading) {
    return (
      <div className="programs-catalog bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '18px', color: 'var(--grey)' }}>Loading academic curriculum...</p>
      </div>
    );
  }

  const filteredCourses = activeCategory === 'All'
    ? coursesList
    : coursesList.filter(c => c.category === activeCategory);

  return (
    <main className="programs-catalog bg-noise">
      <section className="programs-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Academic Curriculum</span>
          </Reveal>
          <Reveal delay={0.08} as="h1">
            Build cognitive and technical leverage
          </Reveal>
          <Reveal delay={0.16} as="p">
            Intensive, program-driven courses designed to teach you how to think, validate, and build products from first principles.
          </Reveal>

          {/* Category Filter Bar */}
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

      <section className="container">
        <div className="programs-grid-main">
          {filteredCourses.map((c, index) => (
            <Reveal key={c.slug} delay={index * 0.08} className="catalog-card hover-lift border-glow">
              <div className="catalog-card__media">
                <span className="catalog-card__badge">{c.category}</span>
                {c.thumbnailText}
              </div>
              <div className="catalog-card__body">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="catalog-card__details">
                  <div className="catalog-card__detail-item">
                    <span>Duration:</span>
                    <strong>{c.duration}</strong>
                  </div>
                  <div className="catalog-card__detail-item">
                    <span>Format:</span>
                    <strong>{c.format}</strong>
                  </div>
                  <div className="catalog-card__detail-item">
                    <span>Level:</span>
                    <strong>{c.level || 'All Levels'}</strong>
                  </div>
                  <div className="catalog-card__detail-item">
                    <span>Instructor:</span>
                    <strong>{c.instructor ? c.instructor.split(' ')[1] : 'Faculty'}</strong>
                  </div>
                </div>
                <div className="catalog-card__footer">
                  <span className="catalog-card__price">{c.price}</span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link to={`/programs/${c.slug}`} className="btn btn-outline" style={{ padding: '10px 16px', fontSize: '13px' }}>
                      Details
                    </Link>
                    <button
                      onClick={() => handleEnroll(c.slug)}
                      className="btn btn-fill catalog-card__btn"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
