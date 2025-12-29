import React, { useEffect, useRef, Component } from 'react';
import { Users, DollarSign, Briefcase, UserPlus } from 'lucide-react';
import { impactStats } from '../../services/womenEcosystemData';
// Map icon names to components
const iconMap: Record<string, ComponentType<any>> = {
  Users,
  DollarSign,
  Briefcase,
  UserPlus
};
const ImpactStatsBar: React.FC = () => {
  // References for each stat value element
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    // Set up the counter animation
    const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        // Format with commas if needed
        element.textContent = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };
    // Observer for scroll animation
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const index = parseInt(element.dataset.index || '0');
          const statValue = impactStats[index].value;
          // Parse the numeric value from the stat
          const numericValue = parseInt(statValue.replace(/,/g, '').replace(/\+/g, '').replace(/AED /g, ''));
          // Animate from 0 to the target value
          animateValue(element, 0, numericValue, 2000);
          // Unobserve after animation starts
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1
    });
    // Observe each stat element
    statRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return <section id="impact-stats" className="py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-5"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {impactStats.slice(0, 4).map((stat, index) => {
          const IconComponent = iconMap[stat.iconName];
          return <div key={stat.id} className="relative group w-64 backdrop-blur-sm bg-gradient-to-br from-white/20 to-white/5 rounded-xl p-6 border border-white/10 shadow-lg transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/10 to-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${stat.iconBgColor}`}>
                    {IconComponent && <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />}
                  </div>
                  <span ref={el => statRefs.current[index] = el} data-index={index} className="text-3xl md:text-4xl font-bold text-white mb-2">
                    0
                  </span>
                  <p className="text-white/80 text-sm md:text-base">
                    {stat.label}
                  </p>
                </div>
              </div>;
        })}
        </div>
      </div>
    </section>;
};
export default ImpactStatsBar;