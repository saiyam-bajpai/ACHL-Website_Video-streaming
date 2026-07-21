import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Reveal from '../Reveal';
import './OurJourney.css';

const items = [
  {
    year: '2025',
    title: 'The Idea',
    text: 'Recognised the growing gap between classroom education and industry expectations.',
  },
  {
    year: '2026',
    title: 'ACHL Founded',
    text: 'Started with a mission to build critical thinkers and future-ready professionals.',
  },
  {
    year: 'Today',
    title: 'Growing Ecosystem',
    text: 'Connecting colleges, students and employers through practical education and hiring.',
  },
];

export default function OurJourney() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.5'],
  });
  const height = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section className="journey section-pad">
      <div className="container">
        <div className="journey__head">
          <Reveal><span className="eyebrow">Our Journey</span></Reveal>
          <Reveal delay={0.08} as="h2" className="journey__title">
            From An Idea To A Mission
          </Reveal>
        </div>

        <div className="journey__timeline" ref={ref}>
          <div className="journey__track">
            <motion.div className="journey__fill" style={{ scaleY: height }} />
          </div>

          {items.map((it, i) => (
            <Reveal key={it.year} delay={i * 0.12} className={`journey__item ${i % 2 === 1 ? 'is-flip' : ''}`}>
              <div className="journey__badge">{it.year}</div>
              <div className="journey__body">
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
