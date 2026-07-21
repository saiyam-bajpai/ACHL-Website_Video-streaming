import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import './CoursePlayer.css';

export default function CoursePlayer() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Use refs to check if note needs saving on unmount/switch
  const currentNoteText = useRef('');
  currentNoteText.current = noteText;
  const prevModuleIdx = useRef(0);
  const prevLessonIdx = useRef(0);

  // Load course details dynamically
  useEffect(() => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');
    
    apiRequest(`/courses/${courseSlug}`)
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('[Course Load Error]', err);
        setError(err.message || 'Access denied. You must be enrolled in this program to play lessons.');
        setLoading(false);
      });
  }, [courseSlug, navigate]);

  // Load completed lessons from database
  useEffect(() => {
    if (!courseSlug) return;
    apiRequest(`/completions/${courseSlug}`)
      .then(keys => {
        setCompletedLessons(keys);
      })
      .catch(err => {
        console.error('Failed to load completed lessons:', err);
      });
  }, [courseSlug]);

  // Load note text when active lesson changes (first save previous)
  useEffect(() => {
    if (!course) return;

    const fetchNote = async () => {
      setNoteText('');
      try {
        const res = await apiRequest(`/notes/${courseSlug}/${activeModuleIdx}/${activeLessonIdx}`);
        setNoteText(res.content || '');
      } catch (err) {
        console.error('Failed to load notes:', err);
      }
    };

    fetchNote();

    // Track previous values for boundary saving
    prevModuleIdx.current = activeModuleIdx;
    prevLessonIdx.current = activeLessonIdx;
  }, [courseSlug, activeModuleIdx, activeLessonIdx, course]);

  if (loading) {
    return (
      <main className="player bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '0' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--black)' }}>Loading syllabus...</h2>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="bg-noise" style={{ padding: '160px 20px', textAlign: 'center', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '600px', background: 'var(--white)', border: '1.5px solid var(--border-soft)', padding: '48px', borderRadius: '16px' }}>
          <span className="eyebrow" style={{ color: 'var(--red)', background: 'rgba(197, 0, 24, 0.05)', padding: '6px 12px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '12.5px', fontWeight: 'bold' }}>Access Restricted</span>
          <h2 style={{ fontSize: '28px', marginTop: '16px', marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--red)' }}>
            {error || 'Program Not Found'}
          </h2>
          <p style={{ color: 'var(--grey)', marginBottom: '32px', lineHeight: '1.6' }}>
            Please make sure you are registered and have purchase authorization for this program.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn btn-fill">Back to Workspace</Link>
            <Link to="/programs" className="btn btn-outline" style={{ color: 'var(--black)', borderColor: 'var(--border-soft)' }}>Browse Programs</Link>
          </div>
        </div>
      </main>
    );
  }

  // Parse JSON fields from DB safely
  const parseJsonField = (field, fallback = []) => {
    if (!field) return fallback;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return fallback;
      }
    }
    return field;
  };

  const curriculum = parseJsonField(course.curriculum, []);
  const activeModule = curriculum?.[activeModuleIdx];
  const activeLesson = activeModule?.lessons?.[activeLessonIdx];

  const lessonKey = `${courseSlug}_m${activeModuleIdx}_l${activeLessonIdx}`;
  const isLessonCompleted = completedLessons.includes(lessonKey);

  const toggleLessonComplete = async () => {
    try {
      const res = await apiRequest(`/completions/${courseSlug}`, {
        method: 'POST',
        body: JSON.stringify({ moduleIdx: activeModuleIdx, lessonIdx: activeLessonIdx })
      });
      const key = `${courseSlug}_m${activeModuleIdx}_l${activeLessonIdx}`;
      if (res.completed) {
        setCompletedLessons(prev => [...prev, key]);
      } else {
        setCompletedLessons(prev => prev.filter(k => k !== key));
      }
    } catch (err) {
      console.error('Failed to toggle lesson completion:', err);
    }
  };

  const saveNoteToDb = async (mIdx = activeModuleIdx, lIdx = activeLessonIdx, textVal = noteText) => {
    setSavingNote(true);
    try {
      await apiRequest(`/notes/${courseSlug}/${mIdx}/${lIdx}`, {
        method: 'POST',
        body: JSON.stringify({ content: textVal })
      });
    } catch (err) {
      console.error('Failed to save study notes:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleNextLesson = async () => {
    if (!curriculum.length) return;

    // Save notes before moving next
    await saveNoteToDb(activeModuleIdx, activeLessonIdx, noteText);

    if (activeLessonIdx + 1 < (activeModule?.lessons?.length || 0)) {
      setActiveLessonIdx(activeLessonIdx + 1);
    } else if (activeModuleIdx + 1 < curriculum.length) {
      setActiveModuleIdx(activeModuleIdx + 1);
      setActiveLessonIdx(0);
    } else {
      alert('Congratulations! You have completed the curriculum syllabus.');
      navigate('/dashboard');
    }
  };

  const selectLesson = async (mIdx, lIdx) => {
    // Save notes before switching lesson
    await saveNoteToDb(activeModuleIdx, activeLessonIdx, noteText);
    setActiveModuleIdx(mIdx);
    setActiveLessonIdx(lIdx);
  };

  return (
    <main className="player bg-noise">
      {/* Curriculum Sidebar */}
      <div className="player-sidebar">
        <h2 className="player-sidebar__title">Course Syllabus</h2>
        
        {curriculum.length === 0 ? (
          <p style={{ color: 'var(--grey)', fontSize: '13.5px' }}>No modules added yet.</p>
        ) : (
          curriculum.map((mod, mIdx) => (
            <div key={mIdx} className="player-sidebar__module">
              <h3 className="player-sidebar__module-title">{mod.module}</h3>
              <div className="player-sidebar__lessons">
                {mod.lessons?.map((les, lIdx) => {
                  const key = `${courseSlug}_m${mIdx}_l${lIdx}`;
                  const completed = completedLessons.includes(key);
                  const active = activeModuleIdx === mIdx && activeLessonIdx === lIdx;
                  
                  return (
                    <button
                      key={lIdx}
                      className={`player-sidebar__lesson-btn ${active ? 'is-active' : ''} ${completed ? 'is-completed' : ''}`}
                      onClick={() => selectLesson(mIdx, lIdx)}
                    >
                      <span>{les}</span>
                      <span>{completed ? '✓' : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Main Content Player */}
      <div className="player-content">
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <Link to="/dashboard" className="dash-section__link">
            ← Back to Student Workspace
          </Link>
          {curriculum.length > 0 && (
            <span style={{ fontSize: '13.5px', color: 'var(--grey)' }}>
              Module {activeModuleIdx + 1} of {curriculum.length}
            </span>
          )}
        </div>

        {/* Video Screen Placeholder */}
        <div className="player-video-box">
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '14px', letterSpacing: '0.15em', display: 'block', color: '#F9F8F6', opacity: 0.6, marginBottom: '8px' }}>
              VIDEO SEMINAR FEEDS
            </span>
            <span style={{ fontSize: '20px', color: 'var(--white)', fontWeight: 600 }}>{activeLesson || 'No lessons loaded'}</span>
          </div>
          {/* Glowing Play Icon */}
          <div style={{
            position: 'absolute',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--red)',
            color: 'var(--white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(197, 0, 24, 0.4)',
            bottom: '24px',
            right: '24px',
            fontWeight: 800
          }}>
            ▶
          </div>
        </div>

        {/* Lesson Description */}
        <div className="player-main-header">
          {activeModule && (
            <span className="eyebrow" style={{ fontSize: '11px', padding: '4px 10px', marginBottom: '8px' }}>
              {activeModule.module}
            </span>
          )}
          <h1>{activeLesson || 'No active lesson'}</h1>
          <p style={{ color: 'var(--grey)', fontSize: '14.5px' }}>Guided by {course.instructor || 'Staff Operator'}</p>
        </div>

        <div className="player-text-pane">
          {activeLesson ? (
            <>
              <p>
                In this session, we dive deep into executing structured frameworks around {activeLesson}. We break down practical implementations, examine real-world traction metrics, and outline common failure vectors.
              </p>
              <p>
                Ensure you take detailed notes in the persistent canvas below. Be ready to share and critique your hypotheses during tomorrow's live peer review.
              </p>
            </>
          ) : (
            <p>Select a lesson from the syllabus sidebar to get started.</p>
          )}
        </div>

        {/* Downloadable Resources */}
        <div style={{ marginTop: '36px', background: 'var(--cream)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
          <h4 style={{ marginBottom: '12px', fontSize: '15px' }}>Downloadable Assets & Checklists:</h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
            <li>
              💾 <a href="#" onClick={e => { e.preventDefault(); alert('Downloading Canvas PDF...'); }} style={{ color: 'var(--maroon)', fontWeight: '600' }}>
                {course.title} — Reasoning Canvas.pdf
              </a>
            </li>
            <li>
              💾 <a href="#" onClick={e => { e.preventDefault(); alert('Downloading Checklists...'); }} style={{ color: 'var(--maroon)', fontWeight: '600' }}>
                Program {activeModuleIdx + 1} — Verification Matrix.xlsx
              </a>
            </li>
          </ul>
        </div>

        {/* Persistent Notes Editor */}
        <div className="player-notes-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3>My Personal Study Notes</h3>
            <span style={{ fontSize: '12px', color: savingNote ? 'var(--red)' : 'var(--grey)' }}>
              {savingNote ? '💾 Saving to database...' : '✓ Saved to DB'}
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--grey)', marginBottom: '12px' }}>Notes are saved to database automatically when you click out of the editor.</p>
          <textarea
            className="player-notes-textarea"
            rows="6"
            placeholder="Type your synthesis, findings, or program discussion questions here..."
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            onBlur={() => saveNoteToDb(activeModuleIdx, activeLessonIdx, noteText)}
          />
          <button
            onClick={() => saveNoteToDb(activeModuleIdx, activeLessonIdx, noteText)}
            className="btn btn-outline"
            style={{ padding: '8px 16px', fontSize: '12px', marginTop: '8px', color: 'var(--black)', borderColor: 'var(--border-soft)' }}
          >
            {savingNote ? 'Saving...' : 'Manual Save Note'}
          </button>
        </div>

        {/* Lesson Player Navigation Footer */}
        <div className="player-footer">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isLessonCompleted}
              disabled={!activeLesson}
              onChange={toggleLessonComplete}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>Mark lesson as complete</span>
          </label>

          <button onClick={handleNextLesson} disabled={!activeLesson} className="btn btn-fill">
            Next Lesson →
          </button>
        </div>
      </div>
    </main>
  );
}
