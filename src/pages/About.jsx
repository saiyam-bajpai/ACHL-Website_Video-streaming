import Reveal from '../components/Reveal';
import './About.css';

const VALUES = [
  {
    title: 'First-Principles Thinking',
    desc: 'We question everything, deconstruct assumptions down to their fundamental truths, and build logic upwards from there.',
  },
  {
    title: 'Actionable Execution',
    desc: 'Thinking is only half the battle. True mastery comes from testing hypotheses in the real world with code, customer interviews, and metrics.',
  },
  {
    title: 'Community-Driven Rigor',
    desc: 'Learning is social. Our programs foster rigorous discussions, constructive critiques, and shared builds that push collective understanding.',
  },
];

const TEAM = [
  { initials: 'AC', name: 'Marcus Chen', role: 'Venture Architect & Principal' },
  { initials: 'EV', name: 'Prof. Evelyn Vance', role: 'Director of Critical Thinking Studies' },
  { initials: 'SJ', name: 'Sarah Jenkins', role: 'Engineering Lead' },
  { initials: 'LP', name: 'Dr. Liam Patel', role: 'Cognitive Computing Advisor' },
];

export default function About() {
  return (
    <main className="bg-noise">
      {/* Hero Section */}
      <section className="about-hero bg-grid">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Our Philosophy</span>
          </Reveal>
          <Reveal delay={0.08} as="h1">
            We are building education for a world where answers are everywhere.
          </Reveal>
          <Reveal delay={0.16} as="p">
            "The typewriter is obsolete, but writing remains. Standard memorization is dead, but thinking has never been more vital."
          </Reveal>
        </div>
      </section>

      {/* Chapters Editorial */}
      <section className="about-editorial">
        <div className="container">
          {/* Chapter 1: The Shift */}
          <div className="about-section">
            <Reveal className="about-section__title">
              <h2>Chapter 1: The Shift</h2>
            </Reveal>
            <Reveal delay={0.08} className="about-section__content">
              <p>
                For centuries, education was about gathering information. Schools rewarded those who could recall facts, memorize equations, and follow templates. 
              </p>
              <p>
                Today, generative models can retrieve, summarize, and outline any topic in milliseconds. Writing code templates and draft copies has become a zero-marginal-cost commodity.
              </p>
              <p>
                In this new landscape, value shifts from the **answers you have** to the **quality of your reasoning**, your capacity to formulate testable hypotheses, and your speed in executing feedback loops.
              </p>
            </Reveal>
          </div>

          {/* Chapter 2: Why ACHL Exists */}
          <div className="about-section">
            <Reveal className="about-section__title">
              <h2>Chapter 2: Why ACHL Exists</h2>
            </Reveal>
            <Reveal delay={0.08} className="about-section__content">
              <p>
                Universities and bootcamps are too slow to adapt. They continue to teach isolated skills rather than cognitive systems. Students learn to write code without understanding why it fits the business, or study business templates without building functional prototypes.
              </p>
              <p>
                ACHL exists to bridge this gap. We combine rigorous mental training with hands-on technical execution. We believe the future belongs to generalist builders who can think deeply, prototype rapidly, and decide wisely.
              </p>
            </Reveal>
          </div>

          {/* Chapter 3: Our Mission */}
          <div className="about-section">
            <Reveal className="about-section__title">
              <h2>Chapter 3: Our Mission</h2>
            </Reveal>
            <Reveal delay={0.08} className="about-section__content">
              <p>
                Our mission is to cultivate the next generation of problem solvers, entrepreneurs, and startup engineers.
              </p>
              <p>
                We do not issue simple certificates for attendance. We train cognitive operators. Every student who completes our programs leaves with verified builds, customer validation insights, and mental systems that scale across domains.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values bg-grid">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Our Pillars</span>
            <h2>Core values guiding ACHL</h2>
            <p>These values define our pedagogy, program discussions, and evaluation structures.</p>
          </Reveal>
          <div className="values-grid">
            {VALUES.map((v, index) => (
              <Reveal key={v.title} delay={index * 0.08} className="value-card hover-lift">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">The Faculty</span>
            <h2>Instructors & Advisors</h2>
            <p>Our team is composed of builders, professors, and technical operators.</p>
          </Reveal>
          <div className="team-grid">
            {TEAM.map((t, index) => (
              <Reveal key={t.name} delay={index * 0.08} className="team-card hover-lift">
                <div className="team-card__avatar">{t.initials}</div>
                <h3>{t.name}</h3>
                <p>{t.role}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
