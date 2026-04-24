import { useRef, ElementType, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

const EASE = [0.23, 1, 0.32, 1] as const;

export default function SectionReveal({ children, as: Tag = 'div', className, delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px 0px' });

  const text = typeof children === 'string' ? children : '';

  if (!text) {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 22 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className} style={{ display: 'block' }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.28em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: delay + i * 0.06, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
