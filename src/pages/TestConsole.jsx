import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import './TestConsole.css';

export default function TestConsole() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Test Details
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Flow control states
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of selected option indices

  // Timer countdown
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef(null);

  // Fullscreen Alert / Cheating Warnings
  const [showWarningModal, setShowWarningModal] = useState(false);
  const warningCountdownRef = useRef(null);
  const [warningSeconds, setWarningSeconds] = useState(5);

  // Post-submit result
  const [testFinished, setTestFinished] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    loadTestDetails();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(warningCountdownRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, navigate]);

  const loadTestDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const data = await apiRequest(`/tests/${slug}`);
      setTest(data);
      setAnswers(new Array(data.questions.length).fill(null));
      setTimeLeft(data.duration * 60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load test parameters.');
    } finally {
      setLoading(false);
    }
  };

  // Force Fullscreen Change listener
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && testStarted && !testFinished) {
      // User exited fullscreen! Trigger warning and 5s autocommit countdown
      setShowWarningModal(true);
      setWarningSeconds(5);
      
      // Auto-submit countdown
      let count = 5;
      clearInterval(warningCountdownRef.current);
      warningCountdownRef.current = setInterval(() => {
        count--;
        setWarningSeconds(count);
        if (count <= 0) {
          clearInterval(warningCountdownRef.current);
          handleAutoSubmit();
        }
      }, 1000);
    }
  };

  const startTest = async () => {
    try {
      // Force fullscreen
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      setTestStarted(true);

      // Start countdown
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      alert('You must enable full-screen mode to begin this academic exam.');
    }
  };

  const reEnterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setShowWarningModal(false);
      clearInterval(warningCountdownRef.current);
    } catch {
      alert('Failed to enter fullscreen. Please maximize your browser window.');
    }
  };

  const handleOptionSelect = (optionIdx) => {
    const updated = [...answers];
    updated[currentQIndex] = optionIdx;
    setAnswers(updated);
  };

  const handleSubmitTest = async () => {
    if (!window.confirm('Are you sure you want to submit your examination answers?')) return;
    
    // Clear timing events
    clearInterval(timerRef.current);
    clearInterval(warningCountdownRef.current);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    try {
      setLoading(true);
      const result = await apiRequest(`/tests/${slug}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          answers
        })
      });
      setTestResult(result);
      setTestFinished(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit test.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    clearInterval(timerRef.current);
    clearInterval(warningCountdownRef.current);
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    
    setShowWarningModal(false);

    try {
      setLoading(true);
      const result = await apiRequest(`/tests/${slug}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          answers
        })
      });
      setTestResult(result);
      setTestFinished(true);
    } catch (err) {
      setErrorMsg(err.message || 'Auto-submit execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="test-console-loader bg-noise">
        <p>Syncing secure testing protocols...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <main className="container" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--red)' }}>Exam Sync Error</h2>
        <p style={{ margin: '16px 0', color: 'var(--grey)' }}>{errorMsg}</p>
        <Link to="/dashboard" className="btn btn-fill">Return to Dashboard</Link>
      </main>
    );
  }

  // 1. INSTRUCTION TERM SCREEN (Pre-exam)
  if (!testStarted && !testFinished) {
    return (
      <main className="test-term-bg bg-noise">
        <div className="test-term-card">
          <span className="eyebrow" style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', marginBottom: '16px' }}>
            Academic Examination Console
          </span>
          <h1>{test.title}</h1>
          <p style={{ color: 'var(--grey)', margin: '14px 0 24px', fontSize: '15px' }}>
            Please read the academic examination guidelines carefully before launching your test session.
          </p>

          <div className="rules-pane">
            <h4>⚠️ Strictly Monitored Security Guidelines:</h4>
            <ul>
              <li><strong>Fullscreen Mode</strong>: Launching the test automatically locks your browser to Fullscreen. Do not press Escape or click away.</li>
              <li><strong>Proctored Environment</strong>: Exiting fullscreen triggers a cheating alert. You will have 5 seconds to re-enter fullscreen before auto-submission.</li>
              <li><strong>No Navigation</strong>: You cannot leave the page, open console inspectors, or switch browser tabs during the test.</li>
              <li><strong>Submission</strong>: Once submitted, your scores and deconstructed mistakes will be immediately saved to the database.</li>
            </ul>
          </div>

          <label className="agree-checkbox-label">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={e => setAgreedTerms(e.target.checked)}
            />
            <span>I agree to the honor code regulations and will complete the exam independently.</span>
          </label>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button
              onClick={startTest}
              className="btn btn-fill"
              style={{ flex: 1, padding: '12px' }}
              disabled={!agreedTerms}
            >
              Start Examination
            </button>
            <Link to="/dashboard" className="btn btn-outline" style={{ padding: '12px 24px' }}>
              Cancel
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. EXAM SUBMISSION SUMMARY VIEW (Post-exam)
  if (testFinished && testResult) {
    return (
      <main className="test-term-bg bg-noise">
        <div className="test-term-card" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: '#007a0f', background: 'rgba(0,197,24,0.05)', borderColor: 'rgba(0,197,24,0.2)', marginBottom: '16px' }}>
            Submission Declared
          </span>
          <h1>Exam Finished!</h1>
          <p style={{ color: 'var(--grey)', margin: '10px 0 32px' }}>
            Your answer sheets have been graded and logged securely in the PostgreSQL database.
          </p>

          <div className="result-stats-block">
            <div className="result-badge">
              <span className="val">{testResult.score}%</span>
              <span>Your Grade</span>
            </div>
            <div className="result-badge">
              <span className="val" style={{ color: 'var(--grey)' }}>{testResult.topperScore}%</span>
              <span>Topper Score</span>
            </div>
            <div className="result-badge">
              <span className="val" style={{ color: 'var(--black)' }}>#{testResult.rank}</span>
              <span>Class Rank</span>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--grey)', margin: '24px 0 32px' }}>
            You can review your incorrect answers and correct choices under the <strong>"Test"</strong> tab in your Student Workspace.
          </p>

          <Link to="/dashboard" className="btn btn-fill" style={{ width: '100%', padding: '12px' }}>
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // 3. EXAM ACTIVE TESTING SCREEN
  const currentQuestion = test.questions[currentQIndex];

  return (
    <main className="exam-viewport">
      {/* Top Console Bar */}
      <header className="exam-bar">
        <div className="exam-bar__title">
          <span>SECURE MONITOR // {user.email}</span>
          <h3>{test.title}</h3>
        </div>
        
        <div className="exam-bar__clock">
          <span>TIME REMAINING</span>
          <strong className={timeLeft < 60 ? 'clock-warning' : ''}>
            {formatTime(timeLeft)}
          </strong>
        </div>
      </header>

      {/* Main Exam Area */}
      <section className="exam-body">
        <div className="exam-card">
          <div className="exam-progress-dots">
            {test.questions.map((_, idx) => (
              <span
                key={idx}
                className={`progress-dot ${idx === currentQIndex ? 'is-active' : ''} ${answers[idx] !== null ? 'is-answered' : ''}`}
              />
            ))}
          </div>

          <div className="question-content">
            <span className="q-number">Question {currentQIndex + 1} of {test.questions.length}</span>
            <h2>{currentQuestion.q}</h2>

            <div className="options-list">
              {currentQuestion.options.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  className={`option-item ${answers[currentQIndex] === oIdx ? 'is-selected' : ''}`}
                  onClick={() => handleOptionSelect(oIdx)}
                >
                  <div className="option-radio" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Nav Controls */}
          <footer className="exam-footer">
            {currentQIndex > 0 ? (
              <button
                className="btn btn-outline"
                style={{ padding: '10px 24px', borderColor: 'var(--border-soft)' }}
                onClick={() => setCurrentQIndex(prev => prev - 1)}
              >
                Back
              </button>
            ) : <div />}

            {currentQIndex < test.questions.length - 1 ? (
              <button
                className="btn btn-fill"
                style={{ padding: '10px 32px' }}
                onClick={() => setCurrentQIndex(prev => prev + 1)}
                disabled={answers[currentQIndex] === null}
              >
                Next Question
              </button>
            ) : (
              <button
                className="btn btn-fill"
                style={{ padding: '10px 32px', background: 'var(--red)' }}
                onClick={handleSubmitTest}
                disabled={answers[currentQIndex] === null}
              >
                Submit Exam
              </button>
            )}
          </footer>
        </div>
      </section>

      {/* Cheating Warning Modal (exited fullscreen) */}
      {showWarningModal && (
        <div className="secure-modal-overlay">
          <div className="secure-modal">
            <h3 style={{ color: 'var(--red)', fontSize: '20px', marginBottom: '12px' }}>⚠️ SECURITY VIOLATION: Fullscreen Exited</h3>
            <p style={{ fontSize: '14.5px', lineHeight: 1.5, color: 'var(--charcoal)', marginBottom: '24px' }}>
              Exiting fullscreen mode violates the proctored exam terms. Please click the button below to re-enter fullscreen immediately.
            </p>
            <div style={{ padding: '14px', background: '#FFF5F5', color: 'var(--red)', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
              Auto-submitting your answer sheet in: {warningSeconds}s
            </div>
            <button onClick={reEnterFullscreen} className="btn btn-fill" style={{ width: '100%', padding: '12px' }}>
              Re-enter Fullscreen & Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
