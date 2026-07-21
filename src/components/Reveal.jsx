import { motion } from 'framer-motion';

export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  duration = 0.7,
  className = '',
  once = true,
  amount = 0.2,
}) {
  const Comp = motion[as] || motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Comp>
  );
}
