import Reveal from '../Reveal';
import './WhyACHL.css';

const features = [
  {
    title: 'Learn From Industry Experts',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 9L12 4 2 9l10 5 10-5z" />
        <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
  {
    title: 'Practical Business Case Studies',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'AI-Era Skills',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9.5 3a5 5 0 00-3 9c.4.4.5 1 .5 1.5V16a2 2 0 002 2h2a2 2 0 002-2v-2.5c0-.5.1-1.1.5-1.5a5 5 0 00-4-9.5z" />
        <path d="M9 21h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Structured Decision Making',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="12" cy="18" r="2.4" />
        <path d="M8 7.4L11 16M16 7.4L13 16M8.5 6h7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Placement Support',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M20.8 14c0 3.5-3.9 6-8.8 6s-8.8-2.5-8.8-6" strokeLinecap="round" />
        <path d="M12 3l1.8 3.6L18 7.2l-3 2.9.7 4-3.7-2-3.7 2 .7-4-3-2.9 4.2-.6L12 3z" />
      </svg>
    ),
  },
  {
    title: 'Industry Recognized Certification',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5L7 21l5-2.6L17 21l-1.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function WhyACHL() {
  return (
    <section className="whyachl section-pad">
      <div className="container">
        <div className="whyachl__head">
          <Reveal><span className="eyebrow">Why ACHL?</span></Reveal>
          <Reveal delay={0.08} as="h2" className="whyachl__title">
            More Than A Certification. A Transformation In Thinking.
          </Reveal>
        </div>

        <div className="whyachl__grid">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={0.06 * i} className="whyachl__card">
              <div className="whyachl__icon">{f.icon}</div>
              <h3>{f.title}</h3>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
