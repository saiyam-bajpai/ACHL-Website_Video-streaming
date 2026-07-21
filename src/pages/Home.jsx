import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import './Home.css';

const PILLARS = [
  {
    num: '01',
    title: 'Think Better',
    desc: 'Unpack mental models, cognitive biases, and logical fallacies. Deconstruct problems from first principles rather than copying trends.',
  },
  {
    num: '02',
    title: 'Find Better Problems',
    desc: 'The best builders don\'t solve obvious issues. Discover how to identify high-leverage bottlenecks, hidden assumptions, and underserved needs.',
  },
  {
    num: '03',
    title: 'Make Better Decisions',
    desc: 'Analyze risk, design testable hypotheses, and make high-stakes decisions under uncertainty. Learn when to pivot and when to double down.',
  },
  {
    num: '04',
    title: 'Build Better',
    desc: 'Translate insights into code, products, and sustainable businesses. Understand engineering architectures and modern software tools.',
  },
];

const COURSES = [
  {
    title: 'Critical Thinking & Problem Design',
    category: 'Critical Thinking',
    duration: '6 Weeks',
    format: 'Live Program',
    price: '$499',
    slug: 'critical-thinking-problem-design',
    desc: 'Deconstruct complex systems, identify hidden assumptions, and define high-leverage problems before writing code.',
  },
  {
    title: 'Venture & Idea Validation',
    category: 'Entrepreneurship',
    duration: '8 Weeks',
    format: 'Program-based',
    price: '$699',
    slug: 'venture-validation',
    desc: 'A hands-on framework to validate startup ideas, test actual market demand, and pitch using first-principles thinking.',
  },
  {
    title: 'Startup Building & Technical Execution',
    category: 'Startup Building',
    duration: '10 Weeks',
    format: 'Interactive Bootcamp',
    price: '$899',
    slug: 'startup-building-execution',
    desc: 'Build and deploy production-ready applications. Understand software architecture, database design, and cloud scaling.',
  },
];

const PROCESS_STEPS = [
  { step: '01', name: 'Learn', desc: 'Study fundamental mental models, design principles, and engineering patterns.' },
  { step: '02', name: 'Think', desc: 'Deconstruct case studies and pressure-test assumptions using critical thinking.' },
  { step: '03', name: 'Apply', desc: 'Build prototypes, write code, and conduct actual customer validations.' },
  { step: '04', name: 'Discuss', desc: 'Review work in small peer programs guided by senior operators and instructors.' },
  { step: '05', name: 'Build', desc: 'Launch real startups, tools, or research papers backed by first-principles.' },
];

const AUDIENCES = [
  {
    title: 'Students & Grads',
    desc: 'Stand out in a crowded market. Master the problem-solving and technical skills that universities fail to teach.',
  },
  {
    title: 'Aspiring Founders',
    desc: 'Avoid building things nobody wants. Learn to systematically validate demand and construct solid MVPs.',
  },
  {
    title: 'Startup Teams',
    desc: 'Align your engineering and product practices. Make faster decisions, avoid technical debt, and execution blockers.',
  },
];

export default function Home() {
  return (
    <main className="bg-noise">
      {/* Hero Section */}
      <section className="home-hero bg-grid">
        <div className="container">
          <Reveal className="home-hero__badge-wrap">
            <span className="home-hero__badge">ACHL Academic Programs</span>
          </Reveal>
          <Reveal delay={0.08} as="h1">
            The world doesn't need more answers. <br />It needs <span>better thinkers.</span>
          </Reveal>
          <Reveal delay={0.16} as="p">
            We teach critical thinking, startup validation, and software architecture to help you build the skills AI cannot replicate.
          </Reveal>
          <Reveal delay={0.24}>
            <div className="home-hero__buttons">
              <Link to="/programs" className="btn btn-accent">Explore Programs</Link>
              <Link to="/about" className="btn btn-outline" style={{ color: '#F9F8F6', borderColor: '#F9F8F6' }}>
                Discover ACHL
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder Message Section */}
      <section className="founder">
        <div className="container founder__grid">
          <Reveal className="founder__image-wrap">
            <img src="/images/founder.png" alt="Founder of ACHL" className="founder__image" />
          </Reveal>
          <div className="founder__content">
            <Reveal>
              <span className="eyebrow">Founder's Message</span>
            </Reveal>
            <Reveal delay={0.08} as="h2" className="founder__title">
              The Future Belongs To Thinkers.
            </Reveal>
            <Reveal delay={0.16} as="p" className="founder__p">
              When I looked around, I realised students were graduating with degrees but struggling to solve practical business problems. At the same time, Artificial Intelligence was changing the nature of work faster than education could adapt.
            </Reveal>
            <Reveal delay={0.24} as="p" className="founder__p">
              ACHL was created with a simple mission — to help people become irreplaceable by developing the one capability machines cannot replicate: independent thinking.
            </Reveal>
            <Reveal delay={0.32} className="founder__quote">
              <p>"Knowledge may open doors, but the ability to think determines how far you go."</p>
            </Reveal>
            <Reveal delay={0.4} as="p" className="founder__sign">
              — Founder, ACHL
            </Reveal>
          </div>
        </div>
      </section>

      {/* Problem Section (The Shift) */}
      <section className="problem-sec">
        <div className="container grid-2col">
          <Reveal className="problem-sec__content">
            <span className="eyebrow">The AI Era</span>
            <h2>Why traditional education is failing us</h2>
            <p>
              In a world where generative AI can generate answers instantly, memorization and standard coding templates have lost their premium.
            </p>
            <p>
              The most valuable skill today is no longer having the answer. It is asking the right questions, framing the problem, and validating assumptions.
            </p>
          </Reveal>
          <Reveal delay={0.16} className="problem-sec__metric">
            <h3>92%</h3>
            <p>
              of founders fail due to premature scaling or building solutions for problems that do not exist. We design curriculum specifically to prevent this.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="pillars-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Core Pillars</span>
            <h2>What ACHL teaches</h2>
            <p>We focus on building long-term intellectual leverage through four key disciplines.</p>
          </Reveal>
          <div className="pillars-grid">
            {PILLARS.map((p, index) => (
              <Reveal key={p.num} delay={index * 0.08} className="pillar-card hover-lift border-glow">
                <div className="pillar-card__icon">{p.num}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="featured-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Featured Programs</span>
            <h2>Our Core Programs</h2>
            <p>Select from intensive programs combining theory, coding, and peer reviews.</p>
          </Reveal>
          <div className="programs-grid">
            {COURSES.map((c, index) => (
              <Reveal key={c.slug} delay={index * 0.08} className="program-card hover-lift border-glow">
                <div className="program-card__img">
                  <span className="program-card__tag">{c.category}</span>
                  {c.title.split(' ')[0]}
                </div>
                <div className="program-card__body">
                  <div className="program-card__meta">
                    <span>{c.duration}</span>
                    <span>•</span>
                    <span>{c.format}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                  <div className="program-card__footer">
                    <span className="program-card__price">{c.price}</span>
                    <Link to={`/programs/${c.slug}`} className="program-card__link">
                      Explore program →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How Learning Works */}
      <section className="process-sec bg-grid">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Learning Framework</span>
            <h2>How learning works at ACHL</h2>
            <p>Our loop is structured to move you from passive learning to active creation.</p>
          </Reveal>
          <div className="process-list">
            {PROCESS_STEPS.map((s, index) => (
              <Reveal key={s.step} delay={index * 0.08} className="process-step">
                <div className="process-step__num">{s.step}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it is For */}
      <section className="audience-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Target Programs</span>
            <h2>Who is this for?</h2>
            <p>ACHL is built for curious minds looking to accelerate their capability loop.</p>
          </Reveal>
          <div className="audience-grid">
            {AUDIENCES.map((a, index) => (
              <Reveal key={a.title} delay={index * 0.08} className="audience-card hover-lift">
                <h3>
                  <span>//</span> {a.title}
                </h3>
                <p>{a.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta bg-noise">
        <div className="container">
          <Reveal>
            <h2>Don't just learn more. Learn to think better.</h2>
            <p>Join our upcoming autumn programs and begin building with first-principles.</p>
            <Link to="/programs" className="btn btn-accent">Explore Programs</Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
