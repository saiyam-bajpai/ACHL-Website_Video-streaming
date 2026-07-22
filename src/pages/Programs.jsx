import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './Programs.css';

const PROGRAM_PACKAGES = [
  {
    slug: 'job-access',
    tag: 'JOB ACCESS',
    price: '₹499',
    desc: 'Two ACET assessments; clear the test to unlock ACHL job portal access.',
    features: ['Two ACET Assessments', 'Job Portal Access', 'Vetted Talent Pool Listing'],
  },
  {
    slug: 'professionals',
    tag: 'PROFESSIONALS',
    price: '₹849',
    desc: '20-day recorded program: critical thinking+ decision-making+ problem-solving.',
    features: ['20-Day Recorded Program', 'Critical Thinking Frameworks', 'Decision-Making Drills', 'Problem-Solving Modules'],
  },
  {
    slug: 'student-track',
    tag: 'STUDENT TRACK',
    price: '₹1,299',
    desc: '30-day program + resume+ LinkedIn optimization+, certification.',
    features: ['30-Day Guided Track', 'Resume Optimization', 'LinkedIn Branding Audit', 'Verified ACHL Certification'],
  },
  {
    slug: 'full-package',
    tag: 'FULL PACKAGE',
    price: '₹1,799',
    desc: '30-day program: live + AI classes, resume, LinkedIn, certification, ACET, job portal access.',
    features: ['30-Day Live + AI Classes', 'Resume & LinkedIn Optimization', 'Verified Certification', 'ACET Test & Job Portal Access'],
  },
];

const PROGRAM_INCLUDES = [
  '30-Day Live Training',
  'Business Case Studies',
  'Critical Thinking Frameworks',
  'Problem Solving Workshops',
  'Decision-Making Simulations',
  'AI for Professionals',
  'Industry Certificate',
  'Placement Support',
];

const WHAT_WE_TEACH = [
  'Cognitive Bias Recognition',
  'Socratic Dialogue Mastery',
  'First-Principles Problem Solving',
  'LLM Literacy & Strategic AI Use',
  'Decision-Making System Architecture',
  'Ethical Reasoning in Business',
  'Risk Decomposition & Pre-Mortems',
  'Capital Allocation Under Ambiguity',
];

const TagIcon = () => (
  <svg className="rate-card__tag-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l11 11 10-10L12 2z" />
    <circle cx="7" cy="7" r="2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="includes-check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 9 10.5 14.5 8 12" />
  </svg>
);

export default function Programs() {
  const [activeTab, setActiveTab] = useState('individuals');
  const navigate = useNavigate();

  // College Form State
  const [collegeData, setCollegeData] = useState({
    collegeName: '',
    repName: '',
    email: '',
    phone: '',
    batchSize: '100-500',
    message: '',
  });
  const [collegeSubmitted, setCollegeSubmitted] = useState(false);

  // Corporate Form State
  const [corporateData, setCorporateData] = useState({
    companyName: '',
    repName: '',
    email: '',
    phone: '',
    teamSize: '10-50',
    focusArea: 'AI Automation & Critical Thinking',
    message: '',
  });
  const [corporateSubmitted, setCorporateSubmitted] = useState(false);

  const handleEnroll = (pkg) => {
    const userStr = localStorage.getItem('achl_user');
    if (!userStr) {
      navigate('/signup');
    } else {
      navigate('/dashboard');
    }
  };

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('achl_contact_submissions') || '[]');
      existing.unshift({
        id: Date.now(),
        name: `${collegeData.repName} (${collegeData.collegeName})`,
        email: collegeData.email,
        subject: `College Tie-up Inquiry - ${collegeData.collegeName}`,
        message: `Phone: ${collegeData.phone} | Batch Size: ${collegeData.batchSize} | ${collegeData.message}`,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('achl_contact_submissions', JSON.stringify(existing));

      try {
        await apiRequest('/contact', {
          method: 'POST',
          body: JSON.stringify({
            name: collegeData.repName,
            email: collegeData.email,
            subject: `College Partnership - ${collegeData.collegeName}`,
            message: collegeData.message,
          }),
        });
      } catch (err) {
        console.log('Backend notification synced:', err.message);
      }

      setCollegeSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCorporateSubmit = async (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('achl_hr_submissions') || '[]');
      existing.unshift({
        id: Date.now(),
        name: corporateData.repName,
        companyName: corporateData.companyName,
        email: corporateData.email,
        phone: corporateData.phone,
        designation: 'Corporate Lead',
        roleRequirement: corporateData.focusArea,
        openings: corporateData.teamSize,
        message: corporateData.message,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('achl_hr_submissions', JSON.stringify(existing));

      try {
        await apiRequest('/hr-submission', {
          method: 'POST',
          body: JSON.stringify({
            name: corporateData.repName,
            companyName: corporateData.companyName,
            email: corporateData.email,
            phone: corporateData.phone,
            roleRequirement: corporateData.focusArea,
            message: corporateData.message,
          }),
        });
      } catch (err) {
        console.log('Backend notification synced:', err.message);
      }

      setCorporateSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="programs-page bg-noise">
      {/* Hero Section */}
      <section className="programs-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow-badge">ACHL ACADEMIC & PARTNERSHIP PROGRAMS</span>
          </Reveal>
          <Reveal delay={0.08} as="h1" className="programs-hero__title">
            Transform How You Think & Build
          </Reveal>
          <Reveal delay={0.16} as="p" className="programs-hero__subtitle">
            Select a program track tailored for individual learners, university tie-ups, or executive corporate training.
          </Reveal>

          {/* 3 Main Navigation Tabs */}
          <Reveal delay={0.24}>
            <div className="program-nav-tabs">
              <button
                className={`tab-btn ${activeTab === 'individuals' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('individuals')}
              >
                1. Individuals (Rate Cards)
              </button>
              <button
                className={`tab-btn ${activeTab === 'colleges' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('colleges')}
              >
                2. College Tie-Up Page
              </button>
              <button
                className={`tab-btn ${activeTab === 'corporates' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('corporates')}
              >
                3. Corporate Training Page
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TAB 1: INDIVIDUALS (RATE CARDS & CURRICULUM) */}
      {activeTab === 'individuals' && (
        <>
          <section className="container">
            <Reveal className="rate-banner-wrapper">
              <div className="rate-cards-grid">
                {PROGRAM_PACKAGES.map((pkg) => (
                  <div key={pkg.slug} className="rate-card hover-lift">
                    <div className="rate-card__top">
                      <TagIcon />
                      <span className="rate-card__tag-label">{pkg.tag}</span>
                    </div>
                    <div className="rate-card__price">{pkg.price}</div>
                    <p className="rate-card__desc">{pkg.desc}</p>
                    <button onClick={() => handleEnroll(pkg)} className="btn btn-accent rate-card__btn">
                      Enroll Now
                    </button>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          <section className="program-curriculum-sec">
            <div className="container curriculum-grid">
              <Reveal className="program-includes-card">
                <h2 className="includes-title">Program Includes</h2>
                <div className="includes-divider" />
                <ul className="includes-list">
                  {PROGRAM_INCLUDES.map((item, idx) => (
                    <li key={idx} className="includes-item">
                      <CheckCircleIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.16} className="what-we-teach-container">
                <h2 className="teach-title">What We Teach</h2>
                <div className="teach-grid">
                  {WHAT_WE_TEACH.map((topic, idx) => (
                    <div key={idx} className="teach-box hover-lift">
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}

      {/* TAB 2: COLLEGE TIE-UP PAGE */}
      {activeTab === 'colleges' && (
        <section className="container sub-page-sec">
          <Reveal className="sub-page-card">
            <div className="sub-page-header">
              <span className="eyebrow">Academic Partnership</span>
              <h2>College & University Tie-Up Program</h2>
              <p>
                Empower your institution with ACHL's industry-tested critical thinking and first-principles software curriculum. We bridge the gap between academic degrees and job employability.
              </p>
            </div>

            <div className="partner-benefits-grid">
              <div className="benefit-box">
                <div className="benefit-icon">🎓</div>
                <h3>Employability Boosting</h3>
                <p>Equip your graduates with Socratic reasoning, risk decomposition, and decision-making skills that top companies seek.</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">📊</div>
                <h3>ACET Assessment Suite</h3>
                <p>Integrate our automated AI test suite into your campus evaluations to measure practical problem-solving capability.</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">🚀</div>
                <h3>Direct Placement Pipeline</h3>
                <p>Connect top performing students directly with our network of 50+ hiring partners and tech enterprises.</p>
              </div>
            </div>

            <div className="sub-page-form-wrapper">
              <h3>Partner Your Institution with ACHL</h3>
              <p style={{ color: '#666', fontSize: '14.5px', marginBottom: '24px' }}>
                Fill in your college details below to schedule an academic syllabus integration meeting.
              </p>

              {collegeSubmitted ? (
                <div className="form-success-msg">
                  <div className="success-icon">✓</div>
                  <h3>College Partnership Request Received!</h3>
                  <p>Our Director of Academic Relations will get in touch with your institution shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleCollegeSubmit} className="sub-page-form">
                  <div className="form-grid-2col">
                    <label>
                      <span>College / University Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. National Institute of Technology"
                        value={collegeData.collegeName}
                        onChange={(e) => setCollegeData({ ...collegeData, collegeName: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Representative Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Hitesh Patel (Dean / HOD)"
                        value={collegeData.repName}
                        onChange={(e) => setCollegeData({ ...collegeData, repName: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="form-grid-2col">
                    <label>
                      <span>Official Email *</span>
                      <input
                        type="email"
                        required
                        placeholder="dean@university.edu.in"
                        value={collegeData.email}
                        onChange={(e) => setCollegeData({ ...collegeData, email: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Phone Number *</span>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={collegeData.phone}
                        onChange={(e) => setCollegeData({ ...collegeData, phone: e.target.value })}
                      />
                    </label>
                  </div>

                  <label>
                    <span>Estimated Student Batch Size</span>
                    <select
                      value={collegeData.batchSize}
                      onChange={(e) => setCollegeData({ ...collegeData, batchSize: e.target.value })}
                    >
                      <option value="50-100">50-100 Students</option>
                      <option value="100-500">100-500 Students</option>
                      <option value="500-1500">500-1500 Students</option>
                      <option value="1500+">1500+ Campus-Wide</option>
                    </select>
                  </label>

                  <label>
                    <span>Partnership Objectives & Message</span>
                    <textarea
                      rows={4}
                      placeholder="Specify departments (B.Tech, MBA, BBA), curriculum focus, or campus placement goals..."
                      value={collegeData.message}
                      onChange={(e) => setCollegeData({ ...collegeData, message: e.target.value })}
                    />
                  </label>

                  <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '14px' }}>
                    Submit College Partnership Inquiry
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      )}

      {/* TAB 3: CORPORATE TRAINING PAGE */}
      {activeTab === 'corporates' && (
        <section className="container sub-page-sec">
          <Reveal className="sub-page-card">
            <div className="sub-page-header">
              <span className="eyebrow">Enterprise Upskilling</span>
              <h2>Corporate Training & AI Automation Program</h2>
              <p>
                Upgrade your product managers, engineering teams, and executive leaders with advanced critical thinking, risk decomposition, and LLM automation tools.
              </p>
            </div>

            <div className="partner-benefits-grid">
              <div className="benefit-box">
                <div className="benefit-icon">🧠</div>
                <h3>Critical Thinking & Decision Audits</h3>
                <p>Train teams to deconstruct cognitive biases, evaluate second-order risk, and execute decision systems under high ambiguity.</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">⚡</div>
                <h3>AI & LLM Automation Literacy</h3>
                <p>Transform employees from passive prompt writers to power users who build automated workflows and LLM agent pipelines.</p>
              </div>
              <div className="benefit-box">
                <div className="benefit-icon">🎯</div>
                <h3>Custom Syllabus Alignment</h3>
                <p>We audit your company's specific product architecture and design bespoke workshops that solve active execution blockers.</p>
              </div>
            </div>

            <div className="sub-page-form-wrapper">
              <h3>Request Corporate Upskilling Proposal</h3>
              <p style={{ color: '#666', fontSize: '14.5px', marginBottom: '24px' }}>
                Fill in your corporate parameters below to receive a custom training syllabus proposal.
              </p>

              {corporateSubmitted ? (
                <div className="form-success-msg">
                  <div className="success-icon">✓</div>
                  <h3>Corporate Training Request Received!</h3>
                  <p>Our Corporate Solutions Director will contact you within 24 hours to schedule a scoping sync.</p>
                </div>
              ) : (
                <form onSubmit={handleCorporateSubmit} className="sub-page-form">
                  <div className="form-grid-2col">
                    <label>
                      <span>Company Name *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Enterprise Global Systems"
                        value={corporateData.companyName}
                        onChange={(e) => setCorporateData({ ...corporateData, companyName: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Contact Representative *</span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Malhotra (VP Engineering)"
                        value={corporateData.repName}
                        onChange={(e) => setCorporateData({ ...corporateData, repName: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="form-grid-2col">
                    <label>
                      <span>Work Email *</span>
                      <input
                        type="email"
                        required
                        placeholder="vikram@enterprise.com"
                        value={corporateData.email}
                        onChange={(e) => setCorporateData({ ...corporateData, email: e.target.value })}
                      />
                    </label>
                    <label>
                      <span>Phone Number *</span>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={corporateData.phone}
                        onChange={(e) => setCorporateData({ ...corporateData, phone: e.target.value })}
                      />
                    </label>
                  </div>

                  <div className="form-grid-2col">
                    <label>
                      <span>Team Size to Upskill</span>
                      <select
                        value={corporateData.teamSize}
                        onChange={(e) => setCorporateData({ ...corporateData, teamSize: e.target.value })}
                      >
                        <option value="5-15">5-15 Members</option>
                        <option value="15-50">15-50 Members</option>
                        <option value="50-150">50-150 Members</option>
                        <option value="150+">150+ Enterprise Department</option>
                      </select>
                    </label>
                    <label>
                      <span>Training Focus Area</span>
                      <select
                        value={corporateData.focusArea}
                        onChange={(e) => setCorporateData({ ...corporateData, focusArea: e.target.value })}
                      >
                        <option value="AI Automation & Critical Thinking">AI Automation & Critical Thinking</option>
                        <option value="Decision Systems & Risk Decomposition">Decision Systems & Risk Decomposition</option>
                        <option value="Software Architecture & Technical Execution">Software Architecture & Technical Execution</option>
                        <option value="Complete Custom Training Package">Complete Custom Training Package</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    <span>Training Objectives & Core Challenges</span>
                    <textarea
                      rows={4}
                      placeholder="Describe team structure, current bottlenecks, or specific training outcomes..."
                      value={corporateData.message}
                      onChange={(e) => setCorporateData({ ...corporateData, message: e.target.value })}
                    />
                  </label>

                  <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '14px' }}>
                    Request Corporate Training Proposal
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </section>
      )}
    </main>
  );
}
