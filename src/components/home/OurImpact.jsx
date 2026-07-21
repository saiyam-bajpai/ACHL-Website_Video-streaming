import Reveal from '../Reveal';
import Counter from '../Counter';
import './OurImpact.css';

const stats = [
  { to: 4000, suffix: '+', label: 'Students Impacted' },
  { to: 25, suffix: '+', label: 'College Collaborations' },
  { to: 50, suffix: '+', label: 'Industry Sessions' },
  { to: 100, suffix: '+', label: 'Hours Of Practical Learning' },
];

export default function OurImpact() {
  return (
    <section className="impact section-pad">
      <div className="container">
        <div className="impact__head">
          <Reveal><span className="eyebrow">Our Impact</span></Reveal>
          <Reveal delay={0.08} as="h2" className="impact__title">
            Building A Strong Learning Ecosystem
          </Reveal>
        </div>

        <div className="impact__grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={0.08 * i} className="impact__card">
              <h3>
                <Counter to={s.to} suffix={s.suffix} />
              </h3>
              <p>{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
