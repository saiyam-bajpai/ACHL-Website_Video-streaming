import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Dashboard.css';

export default function DashboardCourses() {
  const [user, setUser] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [enrolledSlugs, setEnrolledSlugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    loadDashboardCourses(parsedUser.id);
  }, [navigate]);

  const loadDashboardCourses = async (uid) => {
    try {
      setLoading(true);
      const [coursesData, enrollmentsData] = await Promise.all([
        apiRequest('/courses'),
        apiRequest(`/enrollments?userId=${uid}`)
      ]);
      setAllCourses(coursesData);
      setEnrolledSlugs(enrollmentsData);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="dash bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '18px', color: 'var(--grey)' }}>Loading your programs...</p>
      </div>
    );
  }

  const activeCourses = allCourses.filter(c => enrolledSlugs.includes(c.slug));
  const availableCourses = allCourses.filter(c => !enrolledSlugs.includes(c.slug));

  return (
    <main className="dash bg-noise">
      <div className="dash-container">
        {/* Navigation Breadcrumb */}
        <Reveal style={{ marginBottom: '24px' }}>
          <Link to="/dashboard" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
            ← Back to Student Workspace
          </Link>
        </Reveal>

        <Reveal className="dash-section">
          <h1 style={{ fontSize: '32px', marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>My Active Programs</h1>
          <p style={{ color: 'var(--grey)', marginBottom: '32px' }}>Access your lectures, study materials, and program whiteboards.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '32px' }}>
            {activeCourses.map(course => (
              <div key={course.slug} className="catalog-card hover-lift border-glow" style={{ background: 'var(--white)' }}>
                <div className="catalog-card__media" style={{ height: '160px' }}>
                  <span className="catalog-card__badge" style={{ background: 'var(--red)', color: '#F9F8F6' }}>Active</span>
                  {course.thumbnailText}
                </div>
                <div className="catalog-card__body" style={{ padding: '24px' }}>
                  <h3>{course.title}</h3>
                  <p style={{ fontSize: '14px', marginBottom: '20px', minHeight: '60px' }}>{course.desc}</p>
                  <div className="catalog-card__details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', fontSize: '13px', borderTop: '1px solid var(--border-soft)', paddingTop: '16px' }}>
                    <div className="catalog-card__detail-item">
                      <span style={{ color: 'var(--grey)', display: 'block' }}>Duration:</span>
                      <strong>{course.duration}</strong>
                    </div>
                    <div className="catalog-card__detail-item">
                      <span style={{ color: 'var(--grey)', display: 'block' }}>Format:</span>
                      <strong>{course.format}</strong>
                    </div>
                  </div>
                  <Link to={`/learn/${course.slug}`} className="btn btn-fill" style={{ width: '100%', textAlign: 'center' }}>
                    Launch Course Player
                  </Link>
                </div>
              </div>
            ))}

            {activeCourses.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'var(--white)', borderRadius: '16px', border: '1px dashed var(--border-soft)' }}>
                <h3>No active enrollments</h3>
                <p style={{ color: 'var(--grey)', marginTop: '8px', marginBottom: '20px' }}>Explore the catalog to register and start building.</p>
                <Link to="/programs" className="btn btn-fill">Explore Programs</Link>
              </div>
            )}
          </div>
        </Reveal>

        {/* Discovery Upsell Area */}
        {availableCourses.length > 0 && (
          <Reveal className="dash-section" delay={0.08} style={{ marginTop: '64px' }}>
            <h2 style={{ fontSize: '24px', borderBottom: '1.5px solid var(--border-soft)', paddingBottom: '16px', marginBottom: '32px' }}>
              Other Available Programs
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '32px' }}>
              {availableCourses.map(course => (
                <div key={course.slug} className="catalog-card hover-lift" style={{ background: 'var(--white)' }}>
                  <div className="catalog-card__media" style={{ height: '160px' }}>
                    <span className="catalog-card__badge">{course.category}</span>
                    {course.thumbnailText}
                  </div>
                  <div className="catalog-card__body" style={{ padding: '24px' }}>
                    <h3>{course.title}</h3>
                    <p style={{ fontSize: '14.5px', marginBottom: '20px', minHeight: '60px' }}>{course.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-soft)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800 }}>{course.price}</span>
                      <Link to={`/programs/${course.slug}`} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
