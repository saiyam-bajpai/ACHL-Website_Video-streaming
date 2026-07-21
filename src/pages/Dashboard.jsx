import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Dashboard.css';

const MOCK_STUDENTS = ['Aarav Patel', 'Clara Oswald', 'Marcus Chen', 'Arthur Pendelton', 'Liam Patel', 'Evelyn Vance'];
const MOCK_CHATS = [
  'Wow, first-principles deconstruction makes so much sense!',
  'Should we outline system boundaries before doing user tests?',
  'Is the excel sheet for CAC and LTV mapping in the discord?',
  'I am getting solid conversion signals from my landing page smoke test.',
  'Generative AI models make excellent dialectical sparring partners.',
  'Make sure to review the assignment checklist before tomorrow\'s seminar.',
  'Evelyn, will this deck be uploaded to the resources folder?',
  'First-principles reasoning helps a lot in software architecture.'
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, courses, test, help
  
  // Dynamic parameters
  const [stats, setStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  
  // Test Tab states
  const [activeTests, setActiveTests] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [selectedResultReview, setSelectedResultReview] = useState(null); // Result object to show details

  // Help Tab states
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState('');
  const [ticketError, setTicketError] = useState('');

  // Live stream state
  const [showLiveStream, setShowLiveStream] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { user: 'Prof. Evelyn Vance', msg: 'Welcome everyone! Today we are discussing the semantics of framing problems.', isHost: true },
    { user: 'Arthur Pendelton', msg: 'Should we prioritize structural boundaries or customer persona interviews first?' },
    { user: 'Marcus Chen', msg: 'Boundaries first. You must understand the physics of the system before optimizing the user flow.', isHost: true },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);

    loadDashboardData(parsedUser.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadDashboardData = async (uid) => {
    try {
      // 1. Fetch user tasks
      const tasksData = await apiRequest(`/tasks?userId=${uid}`);
      setTasks(tasksData);

      // 2. Fetch all courses and user enrollments
      const [allCourses, enrolledSlugs] = await Promise.all([
        apiRequest('/courses'),
        apiRequest(`/enrollments?userId=${uid}`)
      ]);

      const userCourses = allCourses.filter(c => enrolledSlugs.includes(c.slug));
      setEnrolledCourses(userCourses);

      // 3. Fetch Student Stats
      const statsData = await apiRequest(`/dashboard/student-stats?userId=${uid}`);
      setStats(statsData);

      // 4. Fetch Active Tests
      const testsData = await apiRequest('/tests');
      setActiveTests(testsData);

      // 5. Fetch Test Results
      const resultsData = await apiRequest(`/tests/results?userId=${uid}`);
      setTestResults(resultsData);
    } catch (err) {
      console.error('Failed to load dashboard parameters:', err);
      if (err.message && (err.message.includes('invalid') || err.message.includes('401') || err.message.includes('403') || err.message.includes('not found'))) {
        localStorage.removeItem('achl_user');
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('achl_token');
    localStorage.removeItem('achl_user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const handleDeleteMyAccount = async () => {
    const confirmation = window.prompt(
      "WARNING: This will permanently delete your account and all associated data (enrollments, notes, test completions) from our database.\n\nType 'DELETE' to confirm:"
    );
    if (confirmation === null) return;
    if (confirmation !== 'DELETE') {
      alert('Confirmation word did not match. Account deletion cancelled.');
      return;
    }

    try {
      await apiRequest('/users/me', { method: 'DELETE' });
      alert('Your account and associated data have been permanently erased.');
      handleLogout();
    } catch (err) {
      alert(err.message || 'Failed to delete account. Please try again.');
    }
  };

  // Simulated live chat feed interval when stream is active
  useEffect(() => {
    if (!showLiveStream) return;

    const interval = setInterval(() => {
      const randomStudent = MOCK_STUDENTS[Math.floor(Math.random() * MOCK_STUDENTS.length)];
      const randomMsg = MOCK_CHATS[Math.floor(Math.random() * MOCK_CHATS.length)];
      
      setChatMessages(prev => [
        ...prev,
        { user: randomStudent, msg: randomMsg, isHost: randomStudent.includes('Vance') || randomStudent.includes('Chen') }
      ]);

      const chatContainer = document.getElementById('dash-chat-messages');
      if (chatContainer) {
        setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [showLiveStream]);

  const toggleTask = async (id, currentStatus) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (user) {
        loadDashboardData(user.id);
      }
    } catch (err) {
      console.error('Failed to update task checkmark:', err);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    
    setChatMessages(prev => [
      ...prev,
      { user: user.name, msg: chatInput, isHost: user.role === 'Admin' }
    ]);
    setChatInput('');

    const chatContainer = document.getElementById('dash-chat-messages');
    if (chatContainer) {
      setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 100);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setTicketSuccess('');
    setTicketError('');

    try {
      const payload = { userId: user.id, subject: ticketSubject, message: ticketMessage };
      await apiRequest('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setTicketSuccess('Support ticket created successfully. Our team will review it.');
      setTicketSubject('');
      setTicketMessage('');
    } catch (err) {
      setTicketError(err.message || 'Failed to submit ticket due to system limits.');
    }
  };

  if (!user) return null;

  // Completion percentage
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const overallProgress = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  const continueCourse = enrolledCourses[0] || {
    title: 'Loading Active Course...',
    category: 'System Design',
    slug: 'critical-thinking-problem-design'
  };

  return (
    <main className="dash bg-noise">
      <div className="dash-container">
        
        {/* Welcome Banner */}
        <Reveal className="dash-banner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1>Good morning, {user.name}</h1>
              <p>
                You are enrolled as a <strong>{user.role}</strong>. Keep pushing your intellectual boundaries today.
              </p>
            </div>
            {user.role === 'Admin' && (
              <RouterLink to="/admin" className="btn btn-accent" style={{ padding: '8px 18px', fontSize: '13.5px' }}>
                ⚙️ Access Admin Console
              </RouterLink>
            )}
          </div>
          <div className="dash-banner__progress">
            <div className="dash-progress-label">
              <span>Overall Program Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="dash-progress-bar-bg">
              <div className="dash-progress-bar-fill" style={{ width: `${overallProgress}%` }} />
            </div>
          </div>
        </Reveal>

        {/* Dynamic Inline Live Seminar Stream Player */}
        {showLiveStream && (
          <Reveal className="dash-live-panel">
            <div className="dash-live-header">
              <h2>
                <span className="dash-live-dot" />
                LIVE WORKSHOP: Semantics of Problem Framing
              </h2>
              <button
                className="btn btn-outline"
                style={{ color: '#F9F8F6', borderColor: 'rgba(255, 255, 255, 0.2)', padding: '6px 14px', fontSize: '12.5px' }}
                onClick={() => setShowLiveStream(false)}
              >
                Close Seminar Player
              </button>
            </div>
            <div className="dash-live-grid">
              {/* Left Column: Slides & Stream Watermark */}
              <div className="dash-live-player-area">
                <div className="classroom-watermark" style={{ top: '15px', left: '15px' }}>
                  STREAM CONFIDENTIAL // {user.email} // IP: 192.168.42.100
                </div>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <span className="eyebrow" style={{ color: 'var(--red)', borderColor: 'rgba(197, 0, 24, 0.3)', background: 'rgba(0,0,0,0.5)', marginBottom: '14px', fontSize: '11px' }}>
                    Syllabus Slide 04
                  </span>
                  <h3 style={{ color: '#F9F8F6', fontSize: 'clamp(18px, 3vw, 24px)', maxWidth: '480px', margin: '0 auto 12px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 500 }}>
                    "If I had an hour to solve a problem, I\'d spend 55 minutes thinking about the problem and 5 minutes thinking about solutions."
                  </h3>
                  <p style={{ color: 'var(--red)', fontWeight: 600, fontSize: '13.5px' }}>
                    — Albert Einstein (First-Principles Pedagogy)
                  </p>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  width: '90px',
                  height: '68px',
                  background: '#1C1C1C',
                  borderRadius: '6px',
                  border: '1px solid var(--red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: 'var(--red)'
                }}>
                  [ FACULTY CAM ]
                </div>
              </div>

              {/* Right Column: Chat Box */}
              <div className="dash-live-chat-area">
                <div className="dash-live-chat-messages" id="dash-chat-messages">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className="chat-msg">
                      <strong style={{ color: msg.isHost ? 'var(--red)' : '#7A0010' }}>
                        {msg.user} {msg.isHost ? '★' : ''}
                      </strong>
                      <p style={{ color: 'rgba(249, 248, 246, 0.85)' }}>{msg.msg}</p>
                    </div>
                  ))}
                </div>
                <div className="dash-live-chat-input-box">
                  <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="classroom-chat-input"
                      style={{ padding: '8px 12px', fontSize: '13px' }}
                      placeholder="Ask the faculty a question..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-accent" style={{ padding: '6px 12px', fontSize: '12.5px', borderRadius: '4px' }}>
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* Horizontal Navigation Tabs */}
        <Reveal className="dash-tabs">
          <button
            className={`dash-tab-btn ${activeTab === 'analytics' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'courses' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'test' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('test')}
          >
            Test
          </button>
          <button
            className={`dash-tab-btn ${activeTab === 'help' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            Help & Support
          </button>
        </Reveal>

        {/* 1. ANALYTICS TAB CONTENT */}
        {activeTab === 'analytics' && stats && (
          <Reveal className="analytics-grid">
            <div>
              {/* Analytics highlight cards */}
              <div className="analytics-metrics-grid">
                <div className="metric-highlight-card">
                  <h4>Class Attendance</h4>
                  <div className="metric-highlight-card__val">{stats.attendance}%</div>
                  <span className="metric-highlight-card__sub">Min. required: 90%</span>
                </div>
                <div className="metric-highlight-card">
                  <h4>Fee Ledger Status</h4>
                  <div className="metric-highlight-card__val" style={{ fontSize: '18px', fontWeight: 800, marginTop: '8px' }}>
                    {stats.feesPaid}
                  </div>
                  <span className="metric-highlight-card__sub">No pending invoices</span>
                </div>
                <div className="metric-highlight-card">
                  <h4>Hours Engaged</h4>
                  <div className="metric-highlight-card__val">{stats.hoursEngaged || '14.2 hrs'}</div>
                  <span className="metric-highlight-card__sub">+2.4 hrs this week</span>
                </div>
                <div className="metric-highlight-card">
                  <h4>Latest Test Score</h4>
                  <div className="metric-highlight-card__val">{stats.latestTestScore || 'N/A'}</div>
                  <span className="metric-highlight-card__sub">{stats.latestTestTitle || 'No tests declared'}</span>
                </div>
              </div>

              {/* Continue learning block */}
              <div className="dash-section">
                <h2>Continue Learning</h2>
                <div className="continue-card hover-lift">
                  <div className="continue-card__info">
                    <span className="eyebrow" style={{ fontSize: '11px', padding: '4px 10px', marginBottom: '8px' }}>
                      {continueCourse.category}
                    </span>
                    <h3>{continueCourse.title}</h3>
                    <p>Next Lesson: Mental Model Architecture</p>
                  </div>
                  <RouterLink to={`/learn/${continueCourse.slug}`} className="btn btn-fill">
                    Resume Player
                  </RouterLink>
                </div>
              </div>
            </div>

            {/* Sidebar check lists */}
            <div>
              <div className="dash-widget">
                <h3>My Study Tasks</h3>
                <div className="task-list">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`task-item ${task.completed ? 'is-completed' : ''}`}
                      onClick={() => toggleTask(task.id, task.completed)}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{task.text}</span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p style={{ color: 'var(--grey)', fontSize: '13.5px' }}>No study checklist tasks mapped.</p>
                  )}
                </div>
              </div>

              <div className="dash-widget">
                <h3>Upcoming Milestones</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
                  <div>
                    <strong style={{ color: 'var(--red)', display: 'block' }}>
                      {stats.upcomingTestTitle}
                    </strong>
                    <span style={{ color: 'var(--grey)' }}>Scheduled: {stats.upcomingTestDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 2. COURSES TAB CONTENT */}
        {activeTab === 'courses' && (
          <Reveal className="dash-grid">
            {/* Left Main column */}
            <div>
              <div className="dash-section">
                <h2>My Active Programs</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {enrolledCourses.map(course => (
                    <div key={course.slug} className="catalog-card hover-lift" style={{ background: 'var(--white)' }}>
                      <div className="catalog-card__media" style={{ height: '140px', fontSize: '18px' }}>
                        {course.thumbnailText}
                      </div>
                      <div className="catalog-card__body" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{course.title}</h3>
                        <p style={{ fontSize: '13.5px', marginBottom: '16px', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {course.desc}
                        </p>
                        <div className="dash-card-actions">
                          <RouterLink to={`/programs/${course.slug}`} className="btn btn-outline" style={{ padding: '8px 10px', fontSize: '12px', textAlign: 'center' }}>
                            Syllabus
                          </RouterLink>
                          <RouterLink to={`/learn/${course.slug}`} className="btn btn-fill" style={{ padding: '8px 10px', fontSize: '12px', textAlign: 'center' }}>
                            Play Lecture
                          </RouterLink>
                        </div>
                      </div>
                    </div>
                  ))}

                  {enrolledCourses.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--border-soft)' }}>
                      <p style={{ color: 'var(--grey)', marginBottom: '16px' }}>You are not enrolled in any programs yet.</p>
                      <RouterLink to="/programs" className="btn btn-fill">Browse Programs</RouterLink>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div>
              {/* Upcoming live streams */}
              <div className="dash-widget">
                <h3>Upcoming Live Seminars</h3>
                <div className="class-schedule">
                  <div className="class-card is-live">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Semantics of Problem Framing
                      <span style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px var(--red)' }} />
                    </h4>
                    <span>Today at 6:00 PM (Program A)</span>
                    <button onClick={() => setShowLiveStream(true)} className="btn btn-accent" style={{ padding: '8px 12px', fontSize: '12.5px', borderRadius: '4px', width: '100%' }}>
                      Join Live Class
                    </button>
                  </div>
                </div>
              </div>

              {/* Announcements board */}
              <div className="dash-widget">
                <h3>Board Announcements</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
                  <li style={{ borderBottom: '1px solid var(--border-soft)', paddingBottom: '10px' }}>
                    <strong style={{ color: 'var(--red)' }}>Program Sync:</strong> Tomorrow\'s office hours are moved to 4 PM UTC.
                  </li>
                  <li>
                    <strong style={{ color: 'var(--red)' }}>Peer Grading:</strong> Please review at least two peer problem canvases by Sunday night.
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        )}

        {/* 3. TEST TAB CONTENT */}
        {activeTab === 'test' && (
          <Reveal className="dash-grid">
            {/* Left: Lists */}
            <div>
              {/* Active / Scheduled Exams */}
              <div className="dash-section">
                <h2>Active Scheduled Tests</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {activeTests.map((test) => (
                    <div key={test.id} className="test-result-item" style={{ borderLeft: '4px solid var(--red)' }}>
                      <div className="test-result-meta">
                        <h4>{test.title}</h4>
                        <span>Duration: {test.duration} Minutes | Strict Browser Fullscreen</span>
                      </div>
                      <RouterLink to={`/test/${test.slug}`} className="btn btn-fill" style={{ padding: '10px 20px', fontSize: '13px' }}>
                        Take Test
                      </RouterLink>
                    </div>
                  ))}
                  {activeTests.length === 0 && (
                    <p style={{ color: 'var(--grey)', fontSize: '14.5px' }}>No active tests scheduled currently.</p>
                  )}
                </div>
              </div>

              {/* Declared Results Log */}
              <div className="dash-section">
                <h2>Declared Test Results</h2>
                <div className="test-results-list">
                  {testResults.map((res) => (
                    <div key={res.id} className="test-result-item">
                      <div className="test-result-meta">
                        <h4>{res.testTitle}</h4>
                        <span>Submitted on: {new Date(res.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="test-result-score-block">
                        <div className="score-badge">
                          <span className="score-val">{res.score}%</span>
                          <span>My Score</span>
                        </div>
                        <div className="score-badge">
                          <span className="score-val" style={{ color: 'var(--grey)' }}>{res.topperScore}%</span>
                          <span>Topper</span>
                        </div>
                        <div className="score-badge">
                          <span className="score-val" style={{ color: 'var(--black)' }}>#{res.rank}</span>
                          <span>Class Rank</span>
                        </div>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '8px 16px', fontSize: '12.5px' }}
                          onClick={() => setSelectedResultReview(res)}
                        >
                          View Mistakes
                        </button>
                      </div>
                    </div>
                  ))}
                  {testResults.length === 0 && (
                    <p style={{ color: 'var(--grey)', fontSize: '14.5px' }}>No previous exam records found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Detailed Mistakes Reviewer Card */}
            <div>
              <div className="dash-widget" style={{ minHeight: '300px' }}>
                <h3>Mistakes Deconstruction</h3>
                {selectedResultReview ? (
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>{selectedResultReview.testTitle}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--grey)', marginBottom: '20px' }}>
                      Overall Rank: <strong>#{selectedResultReview.rank}</strong> | Mistakes Count: <strong>{selectedResultReview.mistakes.length}</strong>
                    </p>
                    
                    <h4 className="mistakes-title">Question Breakdown Review:</h4>
                    {selectedResultReview.mistakes.length === 0 ? (
                      <p style={{ color: '#007a0f', fontSize: '13.5px', fontWeight: 600 }}>🌟 Perfect Score! You made zero errors in this exam.</p>
                    ) : (
                      selectedResultReview.mistakes.map((qIdx) => {
                        const question = selectedResultReview.questions?.[qIdx];
                        if (!question) return null;
                        return (
                          <div key={qIdx} className="mistake-card">
                            <h5>{qIdx + 1}. {question.q}</h5>
                            <div className="mistake-details">
                              <span style={{ color: 'var(--red)' }}>
                                <strong>Your incorrect answer:</strong> Option {qIdx === 2 ? 'C' : 'A'} (Mismatch)
                              </span>
                              <span style={{ color: '#007a0f' }}>
                                <strong>Correct answer:</strong> {question.options[question.answerIdx]}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <button
                      className="btn btn-outline"
                      style={{ padding: '6px 12px', fontSize: '12px', marginTop: '16px', width: '100%' }}
                      onClick={() => setSelectedResultReview(null)}
                    >
                      Clear Selection
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--grey)' }}>
                    <p style={{ fontSize: '14px' }}>Select "View Mistakes" on any declared result card to inspect incorrect answers and correct choices.</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* 4. HELP TAB CONTENT */}
        {activeTab === 'help' && (
          <Reveal className="dash-grid">
            {/* Left: Support Form */}
            <div>
              <div className="dash-section">
                <h2>Submit Support Ticket</h2>
                <p style={{ color: 'var(--grey)', fontSize: '14.5px', marginBottom: '24px', maxWidth: '580px' }}>
                  Have questions about your program, schedules, or tuition receipts? File a support ticket directly. Form submits are rate-limited to prevent abuse.
                </p>

                {ticketSuccess && (
                  <div style={{ borderLeft: '4px solid #00c518', background: 'rgba(0,197,24,0.05)', color: '#007a0f', padding: '12px 18px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                    {ticketSuccess}
                  </div>
                )}
                {ticketError && (
                  <div style={{ borderLeft: '4px solid var(--red)', background: 'rgba(197,0,24,0.05)', color: 'var(--red)', padding: '12px 18px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                    <strong>Rate Limit Error:</strong> {ticketError}
                  </div>
                )}

                <form onSubmit={handleSupportSubmit} className="support-form">
                  <label>
                    <span>Subject / Category</span>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Invoice discrepancy, Course access error"
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                    />
                  </label>
                  <label>
                    <span>Details Message</span>
                    <textarea
                      required
                      rows={5}
                      placeholder="Describe the issue in detail..."
                      value={ticketMessage}
                      onChange={e => setTicketMessage(e.target.value)}
                    />
                  </label>
                  <button type="submit" className="btn btn-fill" style={{ width: 'fit-content', padding: '12px 32px' }}>
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Contact info */}
            <div>
              <div className="dash-widget">
                <h3>Contact Operations</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14.5px' }}>
                  <li>
                    <strong style={{ color: 'var(--red)', display: 'block', marginBottom: '4px' }}>Email Support</strong>
                    <a href="mailto:support@achl.com" style={{ textDecoration: 'underline' }}>support@achl.com</a>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--red)', display: 'block', marginBottom: '4px' }}>Call Operator</strong>
                    <span>+1 (800) 555-ACHL (Mon-Fri 9AM-5PM EST)</span>
                  </li>
                  <li>
                    <strong style={{ color: 'var(--red)', display: 'block', marginBottom: '4px' }}>Academic Center</strong>
                    <span style={{ color: 'var(--grey)' }}>Suite 800, Cognitive Science Wing, Manhattan, NY</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        )}

        {/* Account Security & GDPR Control */}
        <Reveal style={{ marginTop: '48px', border: '1.5px solid var(--border-soft)', borderRadius: '16px', padding: '32px', background: 'var(--white)', marginBottom: '40px' }}>
          <h3 style={{ color: 'var(--red)', fontSize: '18px', marginBottom: '8px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Account Controls</h3>
          <p style={{ color: 'var(--grey)', fontSize: '13.5px', marginBottom: '24px' }}>
            Manage active sessions or request permanent removal of all learning data under regulatory specifications.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '10px 24px', fontSize: '13.5px', borderColor: 'var(--border-soft)', color: 'var(--black)' }}>
              Logout Session
            </button>
            <button onClick={handleDeleteMyAccount} className="btn btn-fill" style={{ padding: '10px 24px', fontSize: '13.5px', background: 'var(--red)', borderColor: 'var(--red)' }}>
              Permanently Delete My Data
            </button>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
