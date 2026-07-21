import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import { COURSES } from '../data/courses';
import './ProgramDetail.css';

export default function ProgramDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Accordion state
  const [expandedIndex, setExpandedIndex] = useState(0);

  useEffect(() => {
    loadCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      const dbCourses = await apiRequest('/courses');
      const dbCourse = dbCourses.find(c => c.slug === slug);
      
      if (dbCourse) {
        const localDetails = COURSES.find(c => c.slug === slug) || {};
        setCourse({
          ...localDetails,
          ...dbCourse
        });
      } else {
        setCourse(null);
      }
    } catch (err) {
      console.error('Failed to load course details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/signup');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      await apiRequest('/enrollments', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, courseSlug: course.slug })
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Enrollment error:', err);
    }
  };

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  if (loading) {
    return (
      <div className="bg-noise" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ fontSize: '18px', color: 'var(--grey)' }}>Loading details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <main className="container" style={{ padding: '160px 20px', textAlign: 'center' }}>
        <h2>Course not found</h2>
        <Link to="/programs" className="btn btn-outline" style={{ marginTop: '20px' }}>
          Back to programs
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-noise">
      {/* Hero Header */}
      <section className="prog-detail-hero">
        <div className="container prog-detail-hero__grid">
          <Reveal className="prog-detail-hero__content">
            <span className="eyebrow" style={{ color: 'var(--red)', borderColor: 'rgba(197, 0, 24, 0.2)', background: 'rgba(197, 0, 24, 0.05)' }}>
              {course.category}
            </span>
            <h1>{course.title}</h1>
            <p>{course.desc}</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button onClick={handleEnroll} className="btn btn-accent">
                Enroll in Program
              </button>
              <Link to="/programs" className="btn btn-outline" style={{ color: '#F9F8F6', borderColor: '#F9F8F6' }}>
                Back to Catalog
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="prog-detail-hero__card">
            <span className="prog-detail-hero__price">{course.price}</span>
            <p style={{ color: 'rgba(249, 248, 246, 0.7)', fontSize: '14.5px', marginBottom: '24px' }}>
              Includes live session access, peer review discord, and verified curriculum credentials.
            </p>
            <button onClick={handleEnroll} className="btn btn-fill" style={{ width: '100%', background: '#F9F8F6', color: '#0F0F0F' }}>
              Secure Seat Now
            </button>
            <div className="prog-detail-hero__stats">
              <div className="prog-detail-hero__stat-item">
                <span>Duration</span>
                <strong>{course.duration}</strong>
              </div>
              <div className="prog-detail-hero__stat-item">
                <span>Format</span>
                <strong>{course.format}</strong>
              </div>
              <div className="prog-detail-hero__stat-item">
                <span>Level</span>
                <strong>{course.level}</strong>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Overview & Outcomes */}
      <section className="prog-overview">
        <div className="container prog-overview__grid">
          <div className="prog-overview__section">
            <Reveal>
              <h2>Overview & Key Outcomes</h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--charcoal)', marginBottom: '32px' }}>
                This program is structured around hard execution. You will not sit through hours of passive video lectures. Each week, you will learn a core mental concept, apply it to design specifications or active code pipelines, and defend your outputs in group workshops.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h3>What you will achieve:</h3>
              <div className="prog-overview__outcomes">
                {course.outcomes ? course.outcomes.map((o, idx) => (
                  <div key={idx} className="prog-overview__outcome-item">
                    {o}
                  </div>
                )) : (
                  <>
                    <div className="prog-overview__outcome-item">Deconstruct problems from first principles.</div>
                    <div className="prog-overview__outcome-item">Frame and pitch solutions using verified reasoning models.</div>
                    <div className="prog-overview__outcome-item">Build functional implementations validated by testing constraints.</div>
                  </>
                )}
              </div>
            </Reveal>

            {/* Curriculum Accordion */}
            <Reveal delay={0.16} style={{ marginTop: '56px' }}>
              <h2>Curriculum Structure</h2>
              <div className="curriculum-accordion">
                {course.curriculum ? course.curriculum.map((curr, idx) => (
                  <div key={idx} className="curriculum-item">
                    <button
                      className="curriculum-item__header"
                      onClick={() => toggleAccordion(idx)}
                    >
                      <span>{curr.module}</span>
                      <span>{expandedIndex === idx ? '−' : '+'}</span>
                    </button>
                    {expandedIndex === idx && (
                      <div className="curriculum-item__content">
                        <div className="curriculum-item__lessons">
                          {curr.lessons.map((lesson, lIdx) => (
                            <div key={lIdx} className="curriculum-item__lesson-item">
                              {lesson}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )) : (
                  <p>Curriculum is being finalized.</p>
                )}
              </div>
            </Reveal>
          </div>

          {/* Sidebar Area: Instructor Bio */}
          <div>
            <Reveal className="prog-overview__section">
              <h2>Your Instructor</h2>
              <div className="instructor-bio">
                <div className="instructor-avatar">
                  {(course.instructor || 'Staff Operator').split(' ').map(n => n[0]).join('')}
                </div>
                <div className="instructor-info">
                  <h4>{course.instructor}</h4>
                  <span>{course.instructorTitle}</span>
                  <p>
                    Industry veteran with over a decade of experience designing education pipelines, leading startup ventures, and mentoring engineering programs.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="prog-overview__section" style={{ marginTop: '48px' }}>
              <h2>Who is this for?</h2>
              <div className="faq-card" style={{ background: '#F1EFEA' }}>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14.5px', paddingLeft: '16px', listStyleType: 'disc' }}>
                  <li>Builders wanting cognitive systems that scale across tech and business boundaries.</li>
                  <li>First-time founders eager to design and validate ideas before coding.</li>
                  <li>Product managers and engineering leads scaling system designs.</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="faqs-sec bg-grid">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions regarding programs, schedules, and materials.</p>
          </Reveal>

          <div className="faqs-grid">
            {course.faqs ? course.faqs.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 0.08} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </Reveal>
            )) : (
              <>
                <Reveal className="faq-card">
                  <h3>What is the workload?</h3>
                  <p>Expect about 4-6 hours per week, including core reading materials, building exercises, and program feedback syncs.</p>
                </Reveal>
                <Reveal delay={0.08} className="faq-card">
                  <h3>Can my employer pay for this?</h3>
                  <p>Yes. We provide receipt invoices and syllabus documents to request education credit reimbursement from your company HR.</p>
                </Reveal>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
