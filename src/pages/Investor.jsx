import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Investor.css';

export default function Investor() {
  const [user, setUser] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    if (parsedUser.role !== 'Investor' && parsedUser.role !== 'Admin' && parsedUser.role !== 'SuperAdmin') {
      navigate('/dashboard');
      return;
    }

    loadAnalytics();
  }, [navigate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiRequest('/analytics');
      setMetrics(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load investor metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="investor-page bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Loading investor dashboard...</h2>
      </main>
    );
  }

  if (error || !metrics) {
    return (
      <main className="investor-page bg-noise" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2>Metrics Unavailable</h2>
        <p style={{ color: 'var(--grey)', margin: '16px 0 24px' }}>{error}</p>
        <Link to="/dashboard" className="btn btn-fill">Return to Workspace</Link>
      </main>
    );
  }

  return (
    <main className="investor-page bg-noise bg-grid">
      <div className="container">
        
        {/* Header Eyebrow */}
        <Reveal className="investor-header">
          <span className="eyebrow" style={{ color: 'var(--red)', borderColor: 'rgba(197, 0, 24, 0.2)', background: 'rgba(197, 0, 24, 0.05)' }}>
            Corporate Portal
          </span>
          <h1>Investor Operations</h1>
          <p style={{ color: 'var(--grey)', fontSize: '15px' }}>
            Official platform growth metrics, conversion ratios, and academic statistics.
          </p>
        </Reveal>

        {/* Analytics Section */}
        <div style={{ marginTop: '40px' }}>
          <Reveal className="investor-metrics-grid">
            
            {/* Metric Card 1 */}
            <div className="metric-box">
              <span className="metric-box__title">Unique Monthly Traffic</span>
              <strong className="metric-box__val">{metrics.uniqueVisitsMonth.toLocaleString()}</strong>
              <span className="metric-box__sub text-green">▲ 14.2% vs last month</span>
            </div>

            {/* Metric Card 2 */}
            <div className="metric-box">
              <span className="metric-box__title">Avg Session Duration</span>
              <strong className="metric-box__val">{metrics.avgSessionDuration}</strong>
              <span className="metric-box__sub">Highly engaged peer sessions</span>
            </div>

            {/* Metric Card 3 */}
            <div className="metric-box">
              <span className="metric-box__title">Enrollment Conversion</span>
              <strong className="metric-box__val">{metrics.conversionRate}</strong>
              <span className="metric-box__sub text-green">▲ 0.6% increase</span>
            </div>

            {/* Metric Card 4 */}
            <div className="metric-box">
              <span className="metric-box__title">Active Students</span>
              <strong className="metric-box__val">{metrics.totalStudents}</strong>
              <span className="metric-box__sub">Verified builders on platform</span>
            </div>

            {/* Metric Card 5 */}
            <div className="metric-box">
              <span className="metric-box__title">Total Program Catalog</span>
              <strong className="metric-box__val">{metrics.totalCourses}</strong>
              <span className="metric-box__sub">Dynamic curriculum tracks</span>
            </div>

            {/* Metric Card 6 */}
            <div className="metric-box">
              <span className="metric-box__title">Support Tickets</span>
              <strong className="metric-box__val">{metrics.totalTickets}</strong>
              <span className="metric-box__sub">Total support inquiries filed</span>
            </div>

          </Reveal>

          {/* Platform Performance Visual Grids */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '40px' }} className="investor-detail-row">
            
            {/* Visual Grid 1: Traffic Channels */}
            <Reveal delay={0.08} className="investor-card">
              <h3>Traffic Attribution Channels</h3>
              <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '24px' }}>Attribution of visitor arrivals on the platform.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span>Organic Search (Mental Models content)</span>
                    <strong>45%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: 'var(--red)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span>Direct (Brand Referrals & Discord)</span>
                    <strong>35%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '35%', height: '100%', background: 'var(--black)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span>Partnerships & Startup Portals</span>
                    <strong>20%</strong>
                  </div>
                  <div style={{ height: '8px', background: 'var(--cream)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', background: 'var(--grey)' }} />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Visual Grid 2: Growth Highlights */}
            <Reveal delay={0.16} className="investor-card">
              <h3>Platform Growth Highlights</h3>
              <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '24px' }}>Quarterly key highlights of business performance.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div style={{ padding: '12px', borderLeft: '3px solid var(--red)', background: 'var(--cream)', borderRadius: '0 8px 8px 0' }}>
                  <strong>LTV : CAC ratio holds at 4.2x</strong>
                  <p style={{ fontSize: '13px', color: 'var(--charcoal)', marginTop: '4px' }}>Excellent returns on student acquisition costs.</p>
                </div>
                <div style={{ padding: '12px', borderLeft: '3px solid var(--black)', background: 'var(--cream)', borderRadius: '0 8px 8px 0' }}>
                  <strong>92% Syllabus Completion rate</strong>
                  <p style={{ fontSize: '13px', color: 'var(--charcoal)', marginTop: '4px' }}>Outstanding course completion rates due to active peer groups.</p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>

      </div>
    </main>
  );
}
