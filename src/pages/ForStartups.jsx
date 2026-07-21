import { useState } from 'react';
import Reveal from '../components/Reveal';
import './ForStartups.css';

const OFFERINGS = [
  {
    title: 'Founder Development',
    desc: 'Equip your founders with first-principles mental models, problem deconstruction toolkits, and validated venture building methods.',
  },
  {
    title: 'Startup Team Learning',
    desc: 'Align your engineering and product teams around structured logic, product architecture schemas, and hypothesis testing structures.',
  },
  {
    title: 'Founder Workshops',
    desc: 'Intensive 2-day workshops focusing on deconstructing traction assumptions, modeling unit economics, and identifying core bottlenecks.',
  },
  {
    title: 'Custom Programs',
    desc: 'Tailored curriculum modules built for incubators, accelerators, or growth-stage startup engineering departments.',
  },
];

export default function ForStartups() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    startupName: '',
    teamSize: '1-5',
    stage: 'Ideation',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate lead capture
    console.log('Startup Inquiry:', formData);
    setSubmitted(true);
  };

  return (
    <main className="bg-noise">
      {/* Hero Section */}
      <section className="startups-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow" style={{ color: 'var(--lime)', borderColor: 'rgba(190, 243, 44, 0.2)', background: 'rgba(190, 243, 44, 0.05)' }}>
              Corporate & Startup Programs
            </span>
          </Reveal>
          <Reveal delay={0.08} as="h1">
            Build your team on first principles
          </Reveal>
          <Reveal delay={0.16} as="p">
            We partner with startups, accelerators, and product teams to teach engineering discipline, system design, and hypothesis testing.
          </Reveal>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="offerings-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Services</span>
            <h2>Our custom programs</h2>
            <p>How we help startup teams sharpen execution and mitigate waste.</p>
          </Reveal>

          <div className="offerings-grid">
            {OFFERINGS.map((off, index) => (
              <Reveal key={off.title} delay={index * 0.08} className="offering-card hover-lift">
                <h3>// {off.title}</h3>
                <p>{off.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Inquiry Section */}
      <section className="inquiry-sec">
        <div className="container inquiry-grid">
          <Reveal className="inquiry-info">
            <span className="eyebrow">Connect with Us</span>
            <h2>Request a custom workspace alignment program</h2>
            <p>
              Tell us about your startup or company teams. Our faculty will design an audit framework and a custom training syllabus matching your scaling parameters.
            </p>
            <p style={{ color: 'var(--grey)' }}>
              Average response time: 24 hours. Partnership programs typically scale for programs of 6 to 30 members.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="inquiry-form-card">
            {submitted ? (
              <div className="form-success-msg">
                <h3>✓ Thank you for reaching out!</h3>
                <p style={{ marginTop: '10px', fontSize: '14.5px', fontWeight: 'normal' }}>
                  Our academic relations team will contact you within one business day to schedule a scoping sync.
                </p>
              </div>
            ) : (
              <form className="inquiry-form" onSubmit={handleSubmit}>
                <label>
                  <span>Full name</span>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Aurelius"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      required
                      placeholder="you@startup.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </label>
                  <label>
                    <span>Startup Name</span>
                    <input
                      type="text"
                      required
                      placeholder="Novum Inc."
                      value={formData.startupName}
                      onChange={e => setFormData({ ...formData, startupName: e.target.value })}
                    />
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label>
                    <span>Team Size</span>
                    <select
                      value={formData.teamSize}
                      onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                    >
                      <option value="1-5">1-5 members</option>
                      <option value="6-20">6-20 members</option>
                      <option value="20-50">20-50 members</option>
                      <option value="50+">50+ members</option>
                    </select>
                  </label>
                  <label>
                    <span>Stage</span>
                    <select
                      value={formData.stage}
                      onChange={e => setFormData({ ...formData, stage: e.target.value })}
                    >
                      <option value="Ideation">Ideation / Pre-seed</option>
                      <option value="Seed">Seed Stage</option>
                      <option value="Series A">Series A+</option>
                      <option value="Corporate">Established Enterprise</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>What are you looking to solve?</span>
                  <textarea
                    rows="4"
                    required
                    placeholder="Briefly describe your team structure, core technical issues, or critical thinking objectives..."
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                  />
                </label>
                <button type="submit" className="btn btn-fill" style={{ marginTop: '8px' }}>
                  Submit Scoping Request
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
