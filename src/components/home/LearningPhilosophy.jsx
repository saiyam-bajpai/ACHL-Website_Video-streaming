import Reveal from '../Reveal';
import './LearningPhilosophy.css';

const steps = [
  { n: '01', title: 'Observe', text: 'Understand the situation before reacting.' },
  { n: '02', title: 'Question', text: 'Challenge assumptions and identify biases.' },
  { n: '03', title: 'Analyse', text: 'Evaluate evidence using structured thinking.' },
  { n: '04', title: 'Decide', text: 'Make informed decisions with confidence.' },
  { n: '05', title: 'Improve', text: 'Reflect, learn and continuously evolve.' },
];

export default function LearningPhilosophy() {
  return (
    <section className="philosophy section-pad">
      <div className="container">
        <div className="philosophy__head">
          <Reveal><span className="eyebrow">Our Learning Philosophy</span></Reveal>
          <Reveal delay={0.08} as="h2" className="philosophy__title">
            We Don't Teach Information. We Build Thinking Systems.
          </Reveal>
        </div>

        <div className="philosophy__grid">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={0.08 * i} className="philosophy__card">
              <span className="philosophy__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
