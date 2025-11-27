import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
interface Stat {
  label: string;
  value: string;
}
interface ImpactStatsProps {
  stats: Stat[];
}
// Animated counter component
const AnimatedCounter = ({
  value,
  duration = 2
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, {
    once: true,
    amount: 0.5
  });
  // Extract numeric part and suffix
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  useEffect(() => {
    let startTime;
    let animationFrame;
    if (inView) {
      const step = timestamp => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * numericValue));
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, numericValue, duration]);
  return <span ref={countRef}>
      {count}
      {suffix}
    </span>;
};
const ImpactStats: React.FC<ImpactStatsProps> = ({
  stats
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.3
  });
  // Updated stat labels
  const updatedStats = [{
    label: 'Women-led Startups Supported',
    value: stats[0].value
  }, {
    label: 'Funding Unlocked',
    value: stats[1].value
  }, {
    label: 'Jobs Created',
    value: stats[2].value
  }, {
    label: 'Mentorship Hours',
    value: stats[3].value
  }];
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            Our <span className="text-amber-300">Impact</span>
          </h2>
          <p className="font-body text-lg text-white/80 max-w-2xl mx-auto">
            Measuring the success and growth of women entrepreneurs across the
            UAE.
          </p>
        </div>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {updatedStats.map((stat, index) => <motion.div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center" initial="hidden" animate={controls} variants={{
          hidden: {
            opacity: 0,
            y: 20
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: index * 0.2
            }
          }
        }} whileHover={{
          y: -5,
          backgroundColor: 'rgba(255, 255, 255, 0.15)'
        }}>
              <motion.p className="font-display text-4xl md:text-5xl font-bold text-white mb-2" variants={{
            hidden: {
              opacity: 0,
              scale: 0.8
            },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.8,
                delay: 0.3 + index * 0.2,
                type: 'spring',
                stiffness: 100
              }
            }
          }}>
                <AnimatedCounter value={stat.value} />
              </motion.p>
              <p className="text-white/80">{stat.label}</p>
              {/* Decorative element */}
              <div className="w-12 h-1 bg-amber-300 rounded-full mx-auto mt-4"></div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};
export default ImpactStats;