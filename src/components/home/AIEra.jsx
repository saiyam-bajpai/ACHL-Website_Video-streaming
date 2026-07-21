import Reveal from '../Reveal';
import './AIEra.css';

const cards = [
  {
    title: 'AI Can Generate',
    text: 'Reports, presentations, code and content can now be generated within seconds.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M9 3h6M9 11h.01M15 11h.01M8 19v2M16 19v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Humans Must Evaluate',
    text: 'Businesses still require people who can verify facts, challenge assumptions, manage risk and make decisions.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9.5 3a5 5 0 00-3 9c.4.4.5 1 .5 1.5V16a2 2 0 002 2h2a2 2 0 002-2v-2.5c0-.5.1-1.1.5-1.5a5 5 0 00-4-9.5z" />
        <path d="M9 21h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'ACHL Builds Thinkers',
    text: 'Our programs help learners become professionals who use AI intelligently instead of depending on it blindly.',
    icon: (
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2c2.5 2.5 4 5.5 4 9a4 4 0 01-8 0c0-3.5 1.5-6.5 4-9z" />
        <path d="M9 18l-1 3 4-1 4 1-1-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AIEra() {
  return (
    <section className="aiera section-pad">
      <div className="container">
        <div className="aiera__head">
          <Reveal><span className="eyebrow">The AI Era</span></Reveal>
          <Reveal delay={0.08} as="h2" className="aiera__title">
            AI Is Transforming Work. Human Thinking Is Becoming More Valuable.
          </Reveal>
        </div>

        <div className="aiera__grid">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={0.1 * i} className="aiera__card">
              <div className="aiera__icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
