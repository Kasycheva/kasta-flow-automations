import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxDividerProps {
  variant?: 'a' | 'b' | 'c';
}

export default function ParallaxDivider({ variant = 'a' }: ParallaxDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const y1 = useTransform(scrollYProgress, [0, 1], ['-20px', '20px']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['20px', '-20px']);
  const x1 = useTransform(scrollYProgress, [0, 1], ['-15px', '15px']);

  const configs = {
    a: [
      { cx: '12%',  cy: '50%', r: 3,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.18)' },
      { cx: '30%',  cy: '30%', r: 1.5, yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.10)' },
      { cx: '55%',  cy: '70%', r: 2,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.14)' },
      { cx: '72%',  cy: '40%', r: 1.5, yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.10)' },
      { cx: '88%',  cy: '60%', r: 3,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.18)' },
    ],
    b: [
      { cx: '20%',  cy: '40%', r: 2,   yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.14)' },
      { cx: '45%',  cy: '65%', r: 3,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.18)' },
      { cx: '68%',  cy: '30%', r: 1.5, yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.10)' },
      { cx: '84%',  cy: '55%', r: 2,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.14)' },
    ],
    c: [
      { cx: '8%',   cy: '55%', r: 1.5, yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.10)' },
      { cx: '35%',  cy: '35%', r: 3,   yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.18)' },
      { cx: '60%',  cy: '60%', r: 2,   yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.14)' },
      { cx: '80%',  cy: '40%', r: 1.5, yVar: y2, xVar: x1,  fill: 'rgba(255,255,255,0.10)' },
      { cx: '95%',  cy: '50%', r: 2.5, yVar: y1, xVar: x1,  fill: 'rgba(255,255,255,0.14)' },
    ],
  };

  return (
    <div ref={ref} className="relative h-16 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {configs[variant].map((dot, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', left: dot.cx, top: dot.cy, y: dot.yVar, x: dot.xVar, transform: 'translate(-50%,-50%)' }}
        >
          <svg width={dot.r * 2 + 2} height={dot.r * 2 + 2} viewBox={`0 0 ${dot.r * 2 + 2} ${dot.r * 2 + 2}`}>
            <circle cx={dot.r + 1} cy={dot.r + 1} r={dot.r} fill={dot.fill}/>
          </svg>
        </motion.div>
      ))}
      {/* subtle horizontal rule */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.05]" />
    </div>
  );
}
