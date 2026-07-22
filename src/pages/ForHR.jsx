import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import './ForHR.css';

const HR_FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: 'Pre-Vetted Thinkers',
    desc: 'Our students go through rigorous critical thinking and decision-making scenarios before they even reach you.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Reduced Time to Hire',
    desc: 'Post a requirement, and our system will match you directly with the best-fit students from our ecosystem.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Direct Admin Support',
    desc: 'Our team manually reviews and refers the top candidates directly to your dashboard.',
  },
];

const HR_PARTNERS = [
  { company: 'McKinsey & Company', category: 'MBA Strategy & Consulting', roles: 'Management Consultant & Strategic Analyst', logo: 'McK' },
  { company: 'Goldman Sachs', category: 'MBA Finance & Investment Banking', roles: 'Financial Analyst & Wealth Strategist', logo: 'GS' },
  { company: 'Hindustan Unilever (HUL)', category: 'MBA Marketing & Sales', roles: 'Brand Manager & Marketing Strategist', logo: 'HUL' },
  { company: 'Amazon', category: 'MBA Operations & Supply Chain', roles: 'Supply Chain Specialist & Operations Lead', logo: 'AMZ' },
  { company: 'Deloitte', category: 'MBA Business Analytics', roles: 'Data & Business Analytics Consultant', logo: 'DEL' },
  { company: 'Accenture Strategy', category: 'MBA General Management', roles: 'Corporate Strategy Associate', logo: 'ACN' },
  { company: 'HDFC Bank', category: 'MBA Banking & Wealth Management', roles: 'Relationship Manager & Portfolio Strategist', logo: 'HDFC' },
  { company: 'Procter & Gamble (P&G)', category: 'MBA Brand Management', roles: 'Product & Brand Marketing Lead', logo: 'P&G' },
];

export default function ForHR() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    designation: '',
    roleRequirement: '',
    openings: '1-5',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const scrollToForm = () => {
    const el = document.getElementById('hr-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const existing = JSON.parse(localStorage.getItem('achl_hr_submissions') || '[]');
      const newSubmission = {
        id: Date.now(),
        ...formData,
        submittedAt: new Date().toISOString(),
      };
      existing.unshift(newSubmission);
      localStorage.setItem('achl_hr_submissions', JSON.stringify(existing));

      try {
        await apiRequest('/hr-submission', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      } catch (err) {
        console.log('Backend notification synced or cached:', err.message);
      }

      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try submitting again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="for-hr bg-noise">
      {/* Hero Section */}
      <section className="for-hr-hero bg-grid">
        <div className="container">
          <Reveal className="sec-header" style={{ marginBottom: '32px' }}>
            <span className="eyebrow-badge">ACHL HIRING NETWORK</span>
            <h1 className="for-hr-hero__title">
              Hire Critical Thinkers, <br />Not Just Graduates.
            </h1>
            <p className="for-hr-hero__subtitle">
              Partner with us to access top talent pre-trained in strategic problem solving, cognitive bias recognition, and first-principles thinking.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="for-hr-hero__buttons">
              <button onClick={scrollToForm} className="btn btn-accent">
                Raise Hiring Requirement
              </button>
              <Link to="/login" className="btn btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
                HR Login
              </Link>
            </div>
          </Reveal>

          {/* 3 Value Cards */}
          <div className="for-hr-cards-grid">
            {HR_FEATURES.map((feat, i) => (
              <Reveal key={feat.title} delay={0.24 + i * 0.08} className="for-hr-card hover-lift">
                <div className="for-hr-card__icon-wrap">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Raise Hiring Requirement Form */}
      <section id="hr-form" className="for-hr-form-sec">
        <div className="container">
          <div className="for-hr-form-card">
            <Reveal className="sec-header" style={{ marginBottom: '40px' }}>
              <span className="eyebrow">Recruiter Alignment</span>
              <h2>Raise a Hiring Requirement</h2>
              <p>Fill in your candidate specifications to connect directly with pre-screened ACHL graduates.</p>
            </Reveal>

            {submitted ? (
              <div className="form-success-msg">
                <div className="success-icon">✓</div>
                <h3>Hiring Requirement Received!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>. Our Talent & Placement team will review your specifications for <strong>{formData.companyName}</strong> and contact you within 24 hours at <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      designation: '',
                      roleRequirement: '',
                      openings: '1-5',
                      message: '',
                    });
                  }}
                  className="btn btn-outline"
                  style={{ marginTop: '24px' }}
                >
                  Submit Another Requirement
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="hr-requirement-form">
                {errorMsg && <div className="form-error-banner">{errorMsg}</div>}

                <div className="form-grid-2col">
                  <label>
                    <span>Full Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Company Name *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Novum Tech Solutions"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </label>
                </div>

                <div className="form-grid-2col">
                  <label>
                    <span>Work Email *</span>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Phone / Contact Number *</span>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </label>
                </div>

                <div className="form-grid-2col">
                  <label>
                    <span>Your Designation / Role *</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Head of Talent Acquisition"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Number of Openings</span>
                    <select
                      value={formData.openings}
                      onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                    >
                      <option value="1-5">1-5 Openings</option>
                      <option value="5-15">5-15 Openings</option>
                      <option value="15-30">15-30 Openings</option>
                      <option value="30+">30+ Mass Hiring</option>
                    </select>
                  </label>
                </div>

                <label>
                  <span>Hiring Roles & Core Skill Requirements *</span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Manager (MBA Marketing), Financial Analyst (MBA Finance), Strategy Consultant (MBA Strategy)"
                    value={formData.roleRequirement}
                    onChange={(e) => setFormData({ ...formData, roleRequirement: e.target.value })}
                  />
                </label>

                <label>
                  <span>Additional Details & Role Description</span>
                  <textarea
                    rows={4}
                    placeholder="Describe specific problem-solving skills, location preference, or package details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </label>

                <button type="submit" className="btn btn-accent" disabled={loading} style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
                  {loading ? 'Submitting Requirement...' : 'Raise Hiring Requirement'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Hiring Partners Cards Display Section (Static Cards Layout) */}
      <section className="hr-partners-sec bg-grid">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Recruitment Network</span>
            <h2>Hiring Partners & Enterprise Ecosystem</h2>
            <p>Organizations and tech firms that partner with ACHL to recruit top critical thinkers.</p>
          </Reveal>

          <div className="hr-partners-cards-grid">
            {HR_PARTNERS.map((partner, i) => (
              <Reveal key={partner.company} delay={i * 0.06} className="hr-partner-card hover-lift">
                <div className="hr-partner-card__logo">{partner.logo}</div>
                <h3>{partner.company}</h3>
                <span className="hr-partner-card__category">{partner.category}</span>
                <div className="hr-partner-card__roles-box">
                  <span>Hiring Focus:</span>
                  <strong>{partner.roles}</strong>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
