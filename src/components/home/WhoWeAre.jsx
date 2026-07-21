import Reveal from '../Reveal';
import './WhoWeAre.css';

const cards = [
  {
    title: 'Our Purpose',
    text: 'To create thinkers who can analyse, question, innovate and lead in an AI-driven world.',
  },
  {
    title: 'What Makes ACHL Different',
    text:
      "We don't teach students what to think. We teach them how to think using practical business frameworks, case studies and real-world simulations.",
  },
  {
    title: 'Our Outcome',
    text:
      'Students graduate with stronger reasoning, better communication, improved decision-making and greater confidence for corporate careers.',
  },
];

export default function WhoWeAre() {
  return (
    <section className="whowe section-pad">
      <div className="container">
        <div className="whowe__head">
          <Reveal><span className="eyebrow">Who We Are</span></Reveal>
          <Reveal delay={0.08} as="h2" className="whowe__title">
            Upgrading Human Minds to Remain Relevant in the AI Era
          </Reveal>
          <Reveal delay={0.16} as="p" className="whowe__desc">
            ACHL is an EdTech platform focused on Critical Thinking, Problem Solving and Decision
            Making. We prepare students and young professionals for careers where analytical
            ability, structured thinking and sound judgement matter more than memorisation.
          </Reveal>
        </div>

        <div className="whowe__grid">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={0.1 * i} className="whowe__card">
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
