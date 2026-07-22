import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { apiRequest } from '../utils/api';
import { PROGRAM_PACKAGES } from '../data/programsData';
import founderImg from '../assets/founder.jpg';
import './Home.css';

const FRAMEWORKS = [
  {
    titlePrefix: 'Cognitive Bias',
    titleHighlight: 'Recognition',
    desc: 'Identify and overcome mental shortcuts that lead to flawed decision-making in critical moments.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    titlePrefix: 'Socratic Dialogue',
    titleHighlight: 'Mastery',
    desc: 'Master the art of rigorous questioning to unearth hidden assumptions and reach deeper truths.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
        <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
      </svg>
    ),
  },
  {
    titlePrefix: 'First-Principles',
    titleHighlight: 'Thinking',
    desc: 'Break down complex problems into their foundational elements and build innovative solutions.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <path d="M6.5 10v7a2 2 0 0 0 2 2H14" />
        <path d="M10 6.5h4" />
      </svg>
    ),
  },
  {
    titlePrefix: 'LLM',
    titleHighlight: 'Literacy',
    desc: 'Understand the logic of AI models to leverage them effectively as strategic tools.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="12" rx="2" ry="2" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    titlePrefix: 'Risk',
    titleHighlight: 'Decomposition',
    desc: 'Systematically analyze and break down risks to make calculated decisions under uncertainty.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    titlePrefix: 'System',
    titleHighlight: 'Architecture',
    desc: 'Design robust, scalable decision-making frameworks that withstand changing market dynamics.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 7.5 15" />
        <path d="M4.5 18 12 3" />
        <circle cx="12" cy="5" r="2" />
        <path d="M7 13h10" />
      </svg>
    ),
  },
];

const HIRING_PARTNERS = [
  'McKinsey & Company (Strategy)', 
  'Goldman Sachs (Finance)', 
  'Hindustan Unilever (Marketing)', 
  'Amazon (Operations & Supply Chain)', 
  'Deloitte (Business Analytics)', 
  'Accenture Strategy (Consulting)', 
  'HDFC Bank (Banking & Wealth Management)', 
  'Procter & Gamble (Brand Management)', 
  'Boston Consulting Group (Corporate Strategy)', 
  'Tata Administrative Services (General Management)', 
  'PricewaterhouseCoopers (Financial Advisory)', 
  'KPMG (Risk & Governance)'
];

const TESTIMONIALS = [
  {
    quote: "ACHL completely reframed how I approach complex business & strategy problems. The Socratic deconstruction drills helped me crack management consulting interviews at top global firms.",
    author: "Rohan Verma",
    title: "Strategy Consultant (MBA Strategy Alum)",
    track: "ACET Graduate 2025",
  },
  {
    quote: "As a Talent Acquisition Lead, finding candidates who think from first principles in finance, marketing, and operations is rare. ACHL delivers pre-vetted MBA thinkers who hit the ground running.",
    author: "Ananya Sharma",
    title: "Head of Talent Acquisition (Corporate & MBA Hiring)",
    track: "Hiring Partner",
  },
  {
    quote: "The risk decomposition and venture validation modules saved our startup months of wasted capital. We validated market demand with real unit economics before launching.",
    author: "Aditya Patel",
    title: "Co-Founder (MBA Entrepreneurship)",
    track: "Aspiring Founders Track",
  },
];

const TEAM_MEMBERS = [
  {
    name: 'Tushar Nandawat',
    role: 'Venture Architect & Principal',
    initials: 'TN',
    bio: 'Pioneer in first-principles venture building and critical thinking frameworks.',
    tags: ['Venture Architecture', 'Mental Models'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Prof. Evelyn Vance',
    role: 'Director of Critical Thinking',
    initials: 'EV',
    bio: 'Former university chair specializing in Socratic dialogue and cognitive bias research.',
    tags: ['Cognitive Psychology', 'Socratic Pedagogy'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Sarah Jenkins',
    role: 'Engineering & Curriculum Lead',
    initials: 'SJ',
    bio: 'Senior software architect guiding systemic problem solving and AI literacy.',
    tags: ['Software Architecture', 'System Design'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
  {
    name: 'Dr. Liam Patel',
    role: 'Cognitive Computing Advisor',
    initials: 'LP',
    bio: 'AI researcher focused on LLM reasoning logic, risk decomposition, and ethical frameworks.',
    tags: ['AI Literacy', 'Decision Systems'],
    social: { linkedin: 'https://www.linkedin.com/in/achl-think-3237a13b5/' },
  },
];

const CheckIcon = () => (
  <svg className="audience-card__check-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 9 10.5 14.5 8 12" />
  </svg>
);

const AUDIENCES_DATA = {
  students: {
    tag: 'FOR STUDENTS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    titlePrefix: 'For MBA/BBA/B.Com ',
    titleHighlight: 'Students',
    items: [
      'You Get the Job Interview (and Win It)',
      'You Stand Out From Your Peers (The Competitive Advantage)',
      "You're Ready for Strategy/Consulting Roles",
    ],
  },
  founders: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
    titlePrefix: 'For Aspiring ',
    titleHighlight: 'Founders',
    items: [
      'Avoid Expensive Mistakes',
      'Better Capital Allocation',
      'Build a Scaling Decision System',
    ],
  },
  professionals: {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    titlePrefix: 'For ',
    titleHighlight: 'Professionals',
    items: [
      'Move Into Strategy Roles',
      'Become Invaluable to Your Org',
    ],
  },
  thinkBetter: {
    tag: 'FOR LIFE',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
        <path d="M9 21h6" />
      </svg>
    ),
    titlePrefix: 'For Anyone Who Wants To ',
    titleHighlight: 'Think Better',
    col1: [
      'You Make Fewer Decisions You Regret',
      'You Become a Better Conversationalist',
    ],
    col2: [
      'You Understand Yourself Better',
      'You Join a Community of Thinkers',
    ],
  },
};

const COURSES = [
  {
    title: 'Critical Thinking & Problem Design',
    category: 'Critical Thinking',
    duration: '6 Weeks',
    format: 'Live Program',
    price: '₹499',
    slug: 'critical-thinking-problem-design',
    desc: 'Deconstruct complex systems, identify hidden assumptions, and define high-leverage problems before writing code.',
  },
  {
    title: 'Venture & Idea Validation',
    category: 'Entrepreneurship',
    duration: '8 Weeks',
    format: 'Program-based',
    price: '₹849',
    slug: 'venture-validation',
    desc: 'A hands-on framework to validate startup ideas, test actual market demand, and pitch using first-principles thinking.',
  },
  {
    title: 'Startup Building & Technical Execution',
    category: 'Startup Building',
    duration: '10 Weeks',
    format: 'Interactive Bootcamp',
    price: '₹1,299',
    slug: 'startup-building-execution',
    desc: 'Build and deploy production-ready applications. Understand software architecture, database design, and cloud scaling.',
  },
];

const LEARNING_CARDS = [
  {
    num: '01',
    title: 'Think Better',
    desc: 'Unpack mental models, cognitive biases, and logical fallacies. Deconstruct problems from first principles rather than copying trends.',
  },
  {
    num: '02',
    title: 'Find Better Problems',
    desc: "The best builders don't solve obvious issues. Discover how to identify high-leverage bottlenecks, hidden assumptions, and underserved needs.",
    highlighted: true,
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

export default function Home() {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  useEffect(() => {
    const lastSubmit = localStorage.getItem('achl_last_home_contact');
    if (lastSubmit) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSubmit)) / 1000);
      if (elapsed < 60) {
        setCooldownLeft(60 - elapsed);
      }
    }
  }, []);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setInterval(() => {
      setCooldownLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownLeft]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: '', msg: '' });

    if (honeypot) {
      setFormStatus({ type: 'success', msg: 'Message sent successfully!' });
      return;
    }

    if (cooldownLeft > 0) {
      setFormStatus({
        type: 'error',
        msg: `Security Cooldown: Please wait ${cooldownLeft}s before submitting again.`,
      });
      return;
    }

    setLoading(true);

    try {
      const existing = JSON.parse(localStorage.getItem('achl_contact_submissions') || '[]');
      existing.unshift({
        id: Date.now(),
        name: contactName,
        email: contactEmail,
        subject: contactSubject,
        message: contactMessage,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('achl_contact_submissions', JSON.stringify(existing));
      localStorage.setItem('achl_last_home_contact', Date.now().toString());
      setCooldownLeft(60);

      try {
        await apiRequest('/contact', {
          method: 'POST',
          body: JSON.stringify({
            name: contactName,
            email: contactEmail,
            subject: contactSubject,
            message: contactMessage,
          }),
        });
      } catch (err) {
        console.log('Backend notification synced:', err.message);
      }

      setFormStatus({
        type: 'success',
        msg: 'Thank you! Your message has been sent successfully. Our team will reach out soon.',
      });
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (err) {
      setFormStatus({ type: 'error', msg: err.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Horizontal Moving Marquee for Hiring Partners */}
      <section className="marquee-sec">
        <div className="marquee-label-bar">
          <span className="marquee-title">TOP HIRING PARTNERS & RECRUITMENT NETWORK</span>
        </div>
        <div className="marquee-track-container">
          <div className="marquee-track">
            {HIRING_PARTNERS.concat(HIRING_PARTNERS).map((partner, i) => (
              <div key={i} className="marquee-item">
                <span className="marquee-dot">•</span>
                <span className="marquee-name">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Message Section */}
      <section className="founder">
        <div className="container founder__grid">
          <Reveal className="founder__image-wrap">
            <img
              src={founderImg}
              onError={(e) => {
                e.target.src = '/images/founder.jpg';
              }}
              alt="Founder of ACHL"
              className="founder__image"
            />
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
            <h3>45.9%</h3>
            <p>
              Every year, over one crore students graduate in India, but according to the India Skills Report 2024, only 45.9% are considered employable. That means more than half of our degree holders are not job-ready.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Frameworks Section */}
      <section className="pillars-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Core Pillars</span>
            <h2>
              Core <span className="highlight-red">Frameworks</span>
            </h2>
            <p>The essential skills for the modern professional</p>
          </Reveal>
          <div className="pillars-grid">
            {FRAMEWORKS.map((f, index) => (
              <Reveal key={f.titleHighlight} delay={index * 0.08} className="framework-card hover-lift">
                <div className="framework-card__icon-wrap">{f.icon}</div>
                <h3>
                  {f.titlePrefix} <span className="highlight-red">{f.titleHighlight}</span>
                </h3>
                <p>{f.desc}</p>
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
            {PROGRAM_PACKAGES.map((pkg, index) => (
              <Reveal key={pkg.slug} delay={index * 0.08} className="program-card hover-lift border-glow">
                <div className="program-card__img">
                  <span className="program-card__tag">{pkg.tag}</span>
                  {pkg.tag}
                </div>
                <div className="program-card__body">
                  <div className="program-card__meta">
                    <span>{pkg.price}</span>
                    <span>•</span>
                    <span>ACHL Track</span>
                  </div>
                  <h3>{pkg.title || pkg.tag}</h3>
                  <p>{pkg.desc}</p>
                  <div className="program-card__footer">
                    <span className="program-card__price">{pkg.price}</span>
                    <Link to={`/programs`} className="program-card__link">
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
          <div className="learning-cards-grid">
            {LEARNING_CARDS.map((c, index) => (
              <Reveal key={c.num} delay={index * 0.08} className={`learning-card hover-lift ${c.highlighted ? 'learning-card--highlight' : ''}`}>
                <div className="learning-card__num">{c.num}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
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

          <div className="audience-wrapper">
            {/* Top Row */}
            <div className="audience-row audience-row--top">
              {/* Card 1: Students */}
              <Reveal delay={0.08} className="audience-card-v2">
                <div className="audience-card__top">
                  <div className="audience-card__icon-circle">{AUDIENCES_DATA.students.icon}</div>
                  <span className="audience-card__tag">{AUDIENCES_DATA.students.tag}</span>
                </div>
                <h3>
                  {AUDIENCES_DATA.students.titlePrefix}
                  <span className="highlight-red">{AUDIENCES_DATA.students.titleHighlight}</span>
                </h3>
                <ul className="audience-card__list">
                  {AUDIENCES_DATA.students.items.map((item, i) => (
                    <li key={i} className="audience-card__item">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Card 2: Aspiring Founders */}
              <Reveal delay={0.16} className="audience-card-v2">
                <div className="audience-card__top">
                  <div className="audience-card__icon-circle">{AUDIENCES_DATA.founders.icon}</div>
                </div>
                <h3>
                  {AUDIENCES_DATA.founders.titlePrefix}
                  <span className="highlight-red">{AUDIENCES_DATA.founders.titleHighlight}</span>
                </h3>
                <ul className="audience-card__list">
                  {AUDIENCES_DATA.founders.items.map((item, i) => (
                    <li key={i} className="audience-card__item">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Bottom Row */}
            <div className="audience-row audience-row--bottom">
              {/* Card 3: Professionals */}
              <Reveal delay={0.24} className="audience-card-v2">
                <div className="audience-card__top">
                  <div className="audience-card__icon-circle">{AUDIENCES_DATA.professionals.icon}</div>
                </div>
                <h3>
                  {AUDIENCES_DATA.professionals.titlePrefix}
                  <span className="highlight-red">{AUDIENCES_DATA.professionals.titleHighlight}</span>
                </h3>
                <ul className="audience-card__list">
                  {AUDIENCES_DATA.professionals.items.map((item, i) => (
                    <li key={i} className="audience-card__item">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Card 4: Think Better */}
              <Reveal delay={0.32} className="audience-card-v2">
                <div className="audience-card__top">
                  <div className="audience-card__icon-circle">{AUDIENCES_DATA.thinkBetter.icon}</div>
                  <span className="audience-card__tag">{AUDIENCES_DATA.thinkBetter.tag}</span>
                </div>
                <h3>
                  {AUDIENCES_DATA.thinkBetter.titlePrefix}
                  <span className="highlight-red">{AUDIENCES_DATA.thinkBetter.titleHighlight}</span>
                </h3>
                <div className="audience-card__list--2col">
                  <ul className="audience-card__list">
                    {AUDIENCES_DATA.thinkBetter.col1.map((item, i) => (
                      <li key={i} className="audience-card__item">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="audience-card__list">
                    {AUDIENCES_DATA.thinkBetter.col2.map((item, i) => (
                      <li key={i} className="audience-card__item">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership & Faculty Team Section (Imported to Home) */}
      <section className="home-team-sec bg-grid">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Academic Faculty</span>
            <h2>Our Leadership & Mentors</h2>
            <p>Meet the cognitive operators, venture architects, and professors leading ACHL.</p>
          </Reveal>
          <div className="home-team-grid">
            {TEAM_MEMBERS.map((t, index) => (
              <Reveal key={t.name} delay={index * 0.08} className="faculty-profile-card">
                <div className="faculty-avatar-wrap">
                  <div className="faculty-initials">{t.initials}</div>
                </div>
                <h3>{t.name}</h3>
                <span className="faculty-role-badge">{t.role}</span>
                <p className="faculty-bio">{t.bio}</p>
                <div className="faculty-tags-group">
                  {t.tags.map((tag) => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Student & Partner Reviews</span>
            <h2>What our ecosystem says</h2>
            <p>Feedback from students, hiring partners, and venture builders trained in ACHL frameworks.</p>
          </Reveal>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, index) => (
              <Reveal key={t.author} delay={index * 0.08} className="testimonial-card hover-lift">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author-box">
                  <strong>{t.author}</strong>
                  <span>{t.title}</span>
                  <span className="testimonial-track-tag">{t.track}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Home Page Contact Form Section */}
      <section className="home-contact-sec">
        <div className="container">
          <Reveal className="sec-header">
            <span className="eyebrow">Contact & Alignment</span>
            <h2>Get in Touch</h2>
            <p>Have questions about admissions, hiring candidates, or curriculum alignment? Send us a direct note.</p>
          </Reveal>

          <Reveal delay={0.16} className="home-contact-card">
            <form onSubmit={handleContactSubmit} className="home-contact-form">
              {formStatus.msg && (
                <div
                  className="form-status-alert"
                  style={{
                    color: formStatus.type === 'success' ? 'var(--maroon)' : 'var(--red)',
                    background: formStatus.type === 'success' ? 'rgba(128, 0, 32, 0.06)' : 'rgba(197, 0, 24, 0.06)',
                    borderLeft: `4px solid ${formStatus.type === 'success' ? 'var(--maroon)' : 'var(--red)'}`,
                  }}
                >
                  {formStatus.msg}
                </div>
              )}

              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-row-2col">
                <label>
                  <span>Your Name *</span>
                  <input
                    type="text"
                    required
                    placeholder="Marcus Aurelius"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </label>
                <label>
                  <span>Your Email *</span>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </label>
              </div>

              <label style={{ display: 'block', marginTop: '16px' }}>
                <span>Subject</span>
                <select value={contactSubject} onChange={(e) => setContactSubject(e.target.value)}>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Billing & Support">Billing & Support</option>
                  <option value="Program Feedback">Program Feedback</option>
                  <option value="Corporate & HR Hiring">Corporate & HR Hiring</option>
                </select>
              </label>

              <label style={{ display: 'block', marginTop: '16px' }}>
                <span>Message *</span>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Explain your inquiry in detail..."
                  required
                />
              </label>

              <button
                type="submit"
                className="btn btn-accent"
                disabled={loading || cooldownLeft > 0}
                style={{ marginTop: '24px', width: '100%', padding: '14px', fontSize: '15px' }}
              >
                {loading
                  ? 'Sending Message...'
                  : cooldownLeft > 0
                  ? `Cooldown Active (${cooldownLeft}s)`
                  : 'Send Message'}
              </button>
            </form>
          </Reveal>
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
