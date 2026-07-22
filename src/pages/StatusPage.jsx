import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { API_BASE_URL } from '../utils/api';
import './StatusPage.css';

export default function StatusPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Diagnostic states
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    status: 'testing',
    latencyMs: 0,
    data: null,
    error: null,
  });

  const [wakeUpLoading, setWakeUpLoading] = useState(false);
  const [wakeUpLogs, setWakeUpLogs] = useState([]);

  const [endpointTests, setEndpointTests] = useState({
    health: { status: 'idle', code: null, latency: 0, details: '' },
    authPreflight: { status: 'idle', code: null, latency: 0, details: '' },
    courses: { status: 'idle', code: null, latency: 0, details: '' },
    contact: { status: 'idle', code: null, latency: 0, details: '' },
  });

  useEffect(() => {
    // 1. Verify Super Admin Access
    const userStr = localStorage.getItem('achl_user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUser(u);
        const isAdmin =
          u.role === 'Admin' ||
          u.email === 'agyaat@achllearnings.com' ||
          u.email === 'prabaljaiswal69420@gmail.com';
        setIsSuperAdmin(isAdmin);
      } catch {
        setIsSuperAdmin(false);
      }
    }

    // 2. Initial Health Test
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setBackendStatus((prev) => ({ ...prev, loading: true, error: null }));
    const startTime = Date.now();

    try {
      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const latencyMs = Date.now() - startTime;

      if (res.ok) {
        const json = await res.json();
        setBackendStatus({
          loading: false,
          status: 'online',
          latencyMs,
          data: json,
          error: null,
        });
      } else {
        setBackendStatus({
          loading: false,
          status: 'error',
          latencyMs,
          data: null,
          error: `HTTP Error ${res.status}: ${res.statusText}`,
        });
      }
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      setBackendStatus({
        loading: false,
        status: 'offline',
        latencyMs,
        data: null,
        error: `Failed to fetch (${err.message}). Render backend may be sleeping or blocked by CORS.`,
      });
    }
  };

  const handleWakeUpServer = async () => {
    setWakeUpLoading(true);
    setWakeUpLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Sending wake-up ping to ${API_BASE_URL}/health...`]);

    let attempts = 0;
    const maxAttempts = 6;

    const interval = setInterval(async () => {
      attempts++;
      const pingStart = Date.now();
      try {
        const res = await fetch(`${API_BASE_URL}/health`);
        const pingTime = Date.now() - pingStart;

        if (res.ok) {
          clearInterval(interval);
          setWakeUpLoading(false);
          setWakeUpLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] ✓ SUCCESS! Backend responded in ${pingTime}ms. Render server is fully awake!`,
          ]);
          runHealthCheck();
        } else {
          setWakeUpLogs((prev) => [
            ...prev,
            `[${new Date().toLocaleTimeString()}] Attempt ${attempts}/${maxAttempts}: Received HTTP ${res.status}... retrying...`,
          ]);
        }
      } catch (err) {
        setWakeUpLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Attempt ${attempts}/${maxAttempts}: Server waking up... (${err.message})`,
        ]);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setWakeUpLoading(false);
        setWakeUpLogs((prev) => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ⚠ Completed 6 ping attempts. Please check Render dashboard if server remains offline.`,
        ]);
      }
    }, 4000);
  };

  const testEndpoint = async (key, endpoint, options = {}) => {
    setEndpointTests((prev) => ({
      ...prev,
      [key]: { status: 'testing', code: null, latency: 0, details: 'Testing...' },
    }));

    const start = Date.now();
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const latency = Date.now() - start;
      let details = `HTTP ${res.status} ${res.statusText}`;

      try {
        const json = await res.json();
        details += ` | Payload: ${JSON.stringify(json).substring(0, 100)}...`;
      } catch {
        // text fallback
      }

      setEndpointTests((prev) => ({
        ...prev,
        [key]: {
          status: res.ok ? 'success' : 'warning',
          code: res.status,
          latency,
          details,
        },
      }));
    } catch (err) {
      const latency = Date.now() - start;
      setEndpointTests((prev) => ({
        ...prev,
        [key]: {
          status: 'failed',
          code: 'FETCH_ERROR',
          latency,
          details: `Error: ${err.message}. Check CORS headers or server status.`,
        },
      }));
    }
  };

  // Render Denied Screen for non-super-admins
  if (!isSuperAdmin) {
    return (
      <main className="status-page bg-noise">
        <div className="container" style={{ padding: 'calc(var(--nav-h) + 80px) 0 100px', textAlign: 'center' }}>
          <Reveal className="status-card-denied">
            <div className="lock-icon">🔒</div>
            <h2>Access Restricted</h2>
            <p style={{ color: '#666', maxWidth: '480px', margin: '16px auto 28px', lineHeight: '1.6' }}>
              This hidden component status and diagnostics console is reserved exclusively for ACHL Super Administrators.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-accent">
                Admin Login
              </Link>
              <Link to="/" className="btn btn-outline">
                Return to Homepage
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return (
    <main className="status-page bg-noise">
      <section className="status-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow-badge" style={{ background: '#7A0010', color: '#FFF' }}>
              SUPER ADMIN DIAGNOSTICS
            </span>
          </Reveal>
          <Reveal delay={0.08} as="h1" className="status-hero__title">
            System & Component Health Status
          </Reveal>
          <Reveal delay={0.16} as="p" className="status-hero__subtitle">
            Monitor real-time status of Frontend, Render Backend, PostgreSQL Database, CORS policy, and email dispatchers.
          </Reveal>
        </div>
      </section>

      <section className="container status-body">
        {/* Top Status Cards */}
        <div className="status-cards-grid">
          {/* Frontend Status */}
          <Reveal className="status-widget">
            <div className="widget-header">
              <span className="widget-icon">💻</span>
              <div>
                <h3>Frontend Web App</h3>
                <span className="status-badge status-badge--online">ONLINE</span>
              </div>
            </div>
            <div className="widget-details">
              <div className="detail-row">
                <span>Origin URL:</span>
                <strong>{window.location.origin}</strong>
              </div>
              <div className="detail-row">
                <span>API Endpoint Target:</span>
                <strong>{API_BASE_URL}</strong>
              </div>
              <div className="detail-row">
                <span>Network Connection:</span>
                <strong>{navigator.onLine ? 'Connected (Online)' : 'Offline'}</strong>
              </div>
            </div>
          </Reveal>

          {/* Render Backend Status */}
          <Reveal delay={0.08} className="status-widget">
            <div className="widget-header">
              <span className="widget-icon">⚡</span>
              <div>
                <h3>Render Backend API</h3>
                {backendStatus.loading ? (
                  <span className="status-badge status-badge--testing">TESTING...</span>
                ) : backendStatus.status === 'online' ? (
                  <span className="status-badge status-badge--online">ONLINE ({backendStatus.latencyMs}ms)</span>
                ) : (
                  <span className="status-badge status-badge--error">SLEEPING / OFFLINE</span>
                )}
              </div>
            </div>
            <div className="widget-details">
              <div className="detail-row">
                <span>Response Time:</span>
                <strong>{backendStatus.latencyMs ? `${backendStatus.latencyMs} ms` : 'N/A'}</strong>
              </div>
              <div className="detail-row">
                <span>Server Uptime:</span>
                <strong>{backendStatus.data?.uptimeSeconds ? `${backendStatus.data.uptimeSeconds} seconds` : 'Unknown'}</strong>
              </div>
              <div className="detail-row">
                <span>Status Msg:</span>
                <strong style={{ color: backendStatus.error ? 'var(--red)' : '#111' }}>
                  {backendStatus.error || backendStatus.data?.service || 'Healthy'}
                </strong>
              </div>
            </div>

            <div className="widget-actions">
              <button onClick={runHealthCheck} className="btn btn-outline" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
                Re-check Health
              </button>
              <button
                onClick={handleWakeUpServer}
                className="btn btn-accent"
                disabled={wakeUpLoading}
                style={{ fontSize: '12.5px', padding: '6px 12px' }}
              >
                {wakeUpLoading ? 'Waking Up...' : 'Wake Up Render Server'}
              </button>
            </div>
          </Reveal>

          {/* PostgreSQL Database Health */}
          <Reveal delay={0.16} className="status-widget">
            <div className="widget-header">
              <span className="widget-icon">🗄️</span>
              <div>
                <h3>Prisma PostgreSQL DB</h3>
                {backendStatus.data?.database?.status === 'connected' ? (
                  <span className="status-badge status-badge--online">CONNECTED ({backendStatus.data.database.latencyMs}ms)</span>
                ) : (
                  <span className="status-badge status-badge--error">DISCONNECTED</span>
                )}
              </div>
            </div>
            <div className="widget-details">
              <div className="detail-row">
                <span>DB Latency:</span>
                <strong>{backendStatus.data?.database?.latencyMs ? `${backendStatus.data.database.latencyMs} ms` : 'N/A'}</strong>
              </div>
              <div className="detail-row">
                <span>Total Registered Users:</span>
                <strong>{backendStatus.data?.database?.totalRegisteredUsers ?? 'N/A'}</strong>
              </div>
              <div className="detail-row">
                <span>Environment:</span>
                <strong>{backendStatus.data?.environment || 'Production'}</strong>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Wake Up Log Monitor */}
        {wakeUpLogs.length > 0 && (
          <Reveal className="status-section">
            <h3>Render Server Warmup Console</h3>
            <div className="console-log-box">
              {wakeUpLogs.map((log, index) => (
                <div key={index} className="log-line">{log}</div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Interactive Component & Endpoint Diagnostics */}
        <Reveal className="status-section" style={{ marginTop: '40px' }}>
          <h2>Interactive Component & Endpoint Diagnostics</h2>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
            Run live HTTP tests on individual backend routes to verify CORS headers, preflight checks, and error responses.
          </p>

          <div className="tests-matrix-grid">
            {/* Test 1: GET /api/health */}
            <div className="test-card">
              <div className="test-card__top">
                <span className="test-method">GET</span>
                <span className="test-path">/api/health</span>
                <button
                  onClick={() => testEndpoint('health', '/health')}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Run Test
                </button>
              </div>
              <p className="test-desc">Verifies server uptime, memory usage, and DB query ping.</p>
              {endpointTests.health.status !== 'idle' && (
                <div className={`test-result test-result--${endpointTests.health.status}`}>
                  <span>Latency: {endpointTests.health.latency}ms</span> | <span>{endpointTests.health.details}</span>
                </div>
              )}
            </div>

            {/* Test 2: CORS Preflight check */}
            <div className="test-card">
              <div className="test-card__top">
                <span className="test-method">OPTIONS</span>
                <span className="test-path">/api/auth/login</span>
                <button
                  onClick={() =>
                    testEndpoint('authPreflight', '/auth/login', {
                      method: 'POST',
                      body: { email: 'test@domain.com', password: 'password123' },
                    })
                  }
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Run Test
                </button>
              </div>
              <p className="test-desc">Tests CORS preflight headers and authentication endpoint payload acceptance.</p>
              {endpointTests.authPreflight.status !== 'idle' && (
                <div className={`test-result test-result--${endpointTests.authPreflight.status}`}>
                  <span>Latency: {endpointTests.authPreflight.latency}ms</span> | <span>{endpointTests.authPreflight.details}</span>
                </div>
              )}
            </div>

            {/* Test 3: Public Courses Endpoint */}
            <div className="test-card">
              <div className="test-card__top">
                <span className="test-method">GET</span>
                <span className="test-path">/api/courses</span>
                <button
                  onClick={() => testEndpoint('courses', '/courses')}
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Run Test
                </button>
              </div>
              <p className="test-desc">Verifies database course retrieval and JSON serialization.</p>
              {endpointTests.courses.status !== 'idle' && (
                <div className={`test-result test-result--${endpointTests.courses.status}`}>
                  <span>Latency: {endpointTests.courses.latency}ms</span> | <span>{endpointTests.courses.details}</span>
                </div>
              )}
            </div>

            {/* Test 4: Contact Submission Route */}
            <div className="test-card">
              <div className="test-card__top">
                <span className="test-method">POST</span>
                <span className="test-path">/api/contact</span>
                <button
                  onClick={() =>
                    testEndpoint('contact', '/contact', {
                      method: 'POST',
                      body: {
                        name: 'Diagnostics Runner',
                        email: 'agyaat@achllearnings.com',
                        subject: 'Status Page Test',
                        message: 'Automated test ping from /no-access/status console.',
                      },
                    })
                  }
                  className="btn btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  Run Test
                </button>
              </div>
              <p className="test-desc">Verifies contact inquiry submission and Nodemailer email pipeline.</p>
              {endpointTests.contact.status !== 'idle' && (
                <div className={`test-result test-result--${endpointTests.contact.status}`}>
                  <span>Latency: {endpointTests.contact.latency}ms</span> | <span>{endpointTests.contact.details}</span>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
