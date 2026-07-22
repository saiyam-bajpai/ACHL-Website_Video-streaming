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

const TEAM_MEMBERS = [
  {
    name: 'Tushar Nandawat',
    role: 'Venture Architect & Principal',
    initials: 'TN',
    photo: '',
    bio: 'Pioneer in first-principles venture building and critical thinking frameworks.',
    tags: ['Venture Architecture', 'Mental Models'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Prof. Evelyn Vance',
    role: 'Director of Critical Thinking',
    initials: 'EV',
    photo: '',
    bio: 'Former university chair specializing in Socratic dialogue and cognitive bias research.',
    tags: ['Cognitive Psychology', 'Socratic Pedagogy'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Sarah Jenkins',
    role: 'Engineering & Curriculum Lead',
    initials: 'SJ',
    photo: '',
    bio: 'Senior software architect guiding systemic problem solving and AI literacy.',
    tags: ['Software Architecture', 'System Design'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Dr. Liam Patel',
    role: 'Cognitive Computing Advisor',
    initials: 'LP',
    photo: '',
    bio: 'AI researcher focused on LLM reasoning logic, risk decomposition, and ethical frameworks.',
    tags: ['AI Literacy', 'Decision Systems'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
];

const DEVELOPERS = [
  {
    name: 'Prabal Jaiswal',
    role: 'Lead Full-Stack Developer & Architect',
    initials: 'PJ',
    photo: '', // Put profile image URL here e.g. '/images/devs/prabal.jpg'
    bio: 'Architected the core ACHL platform, interactive assessment engine, database schemas, and recruitment system.',
    stack: ['React 19', 'Node.js', 'Vite 8', 'Express API', 'Prisma DB'],
    contact: 'agyaat@achllearnings.com',
    social: {
      github: 'https://github.com',
      linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/',
    },
  },
  {
    name: 'Agyaat & Tech Team',
    role: 'Frontend & Systems Engineering Team',
    initials: 'AG',
    photo: '',
    bio: 'Crafted responsive modern UI design system, rate-limiting security, mailing services, and admin controls.',
    stack: ['JavaScript', 'CSS3', 'Nodemailer', 'Authentication', 'Security'],
    contact: 'agyaat@achllearnings.com',
    social: {
      instagram: 'https://www.instagram.com/achl.think',
      linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/',
    },
  },
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
                In this new landscape, value shifts from the <strong>answers you have</strong> to the <strong>quality of your reasoning</strong>, your capacity to formulate testable hypotheses, and your speed in executing feedback loops.
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
            <h2>Leadership & Academic Team</h2>
            <p>Our academic leadership is composed of builders, professors, and technical operators.</p>
          </Reveal>

          <div className="team-cards-wrapper">
            {TEAM_MEMBERS.map((t, index) => (
              <Reveal key={t.name} delay={index * 0.08} className="faculty-profile-card">
                <div className="faculty-avatar-wrap">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="faculty-photo" />
                  ) : (
                    <div className="faculty-initials">{t.initials}</div>
                  )}
                </div>
                <h3>{t.name}</h3>
                <span className="faculty-role-badge">{t.role}</span>
                <p className="faculty-bio">{t.bio}</p>
                <div className="faculty-tags-group">
                  {t.tags.map((tag) => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
                <a href={t.social.linkedin} target="_blank" rel="noopener noreferrer" className="faculty-link">
                  LinkedIn →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="about-developers">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Platform Engineers</span>
            <h2>Website Engineering & Development Team</h2>
            <p>Meet the engineers and architects who built the ACHL platform and system infrastructure.</p>
          </Reveal>

          <div className="dev-cards-wrapper">
            {DEVELOPERS.map((dev, index) => (
              <Reveal key={dev.name} delay={index * 0.12} className="dev-profile-card">
                <div className="dev-profile-header">
                  <div className="dev-avatar-wrap">
                    {dev.photo ? (
                      <img src={dev.photo} alt={dev.name} className="dev-photo" />
                    ) : (
                      <div className="dev-initials">{dev.initials}</div>
                    )}
                  </div>
                  <div>
                    <h3>{dev.name}</h3>
                    <span className="dev-role-badge">{dev.role}</span>
                  </div>
                </div>

                <p className="dev-bio">{dev.bio}</p>

                <div className="dev-stack-box">
                  <span className="stack-heading">TECH STACK & ARCHITECTURE</span>
                  <div className="stack-chips">
                    {dev.stack.map((s) => (
                      <span key={s} className="stack-chip">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="dev-footer-row">
                  <a href={`mailto:${dev.contact}`} className="dev-email-btn">
                    ✉ {dev.contact}
                  </a>
                  <div className="dev-social-links">
                    {dev.social.github && (
                      <a href={dev.social.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                    {dev.social.linkedin && (
                      <a href={dev.social.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {dev.social.instagram && (
                      <a href={dev.social.instagram} target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
