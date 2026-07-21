import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import './Hero.css';

const headline = ['Building Thinkers.', 'Creating Leaders.', 'Preparing Minds for the AI Era.'];

function useNodes(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 3,
        size: 2 + Math.random() * 3,
      })),
    [count]
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.15 },
  },
};

const line = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const nodes = useNodes(28);
  return (
    <section className="hero">
      <div className="hero__field" aria-hidden="true">
        {nodes.map((n, i) => (
          <span
            key={i}
            className="hero__node"
            style={{
              left: `${n.left}%`,
              top: `${n.top}%`,
              width: n.size,
              height: n.size,
              animationDelay: `${n.delay}s`,
              animationDuration: `${n.duration}s`,
            }}
          />
        ))}
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
      </div>

      <div className="container hero__inner">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="eyebrow">About ACHL</span>
        </motion.div>

        <motion.h1 className="hero__title" variants={container} initial="hidden" animate="show">
          {headline.map((l, i) => (
            <motion.span className="hero__line" key={i} variants={line}>
              {l}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="hero__desc"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          ACHL (Agyaat Corporate &amp; Holistic Learning) exists to bridge the gap between academic
          education and real-world decision making. We believe knowledge alone is no longer enough.
          The future belongs to people who can think critically, solve problems creatively and make
          sound decisions.
        </motion.p>

        <motion.div
          className="hero__actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/certification-program" className="btn btn-fill">Explore Program</Link>
          <Link to="/contact" className="btn btn-outline">Contact Us</Link>
        </motion.div>
      </div>
    </section>
  );
}
