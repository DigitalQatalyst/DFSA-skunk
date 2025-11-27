import React from 'react';
import { motion } from 'framer-motion';
interface JoinCommunityProps {
  onShareClick: () => void;
  onPartnerClick: () => void;
}
const JoinCommunity: React.FC<JoinCommunityProps> = ({
  onShareClick,
  onPartnerClick
}) => {
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto max-w-5xl">
        <motion.div className="bg-white rounded-2xl shadow-xl overflow-hidden relative" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        amount: 0.3
      }} transition={{
        duration: 0.6
      }}>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 via-transparent to-purple-light/10"></div>
          {/* UAE pattern overlay */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" className="text-amber-500">
              <defs>
                <pattern id="uaePattern" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M0 0L60 0L30 52L0 0Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#uaePattern)" />
            </svg>
          </div>
          {/* Content */}
          <div className="relative p-8 md:p-12 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <motion.div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6" initial={{
              scale: 0.8,
              opacity: 0
            }} whileInView={{
              scale: 1,
              opacity: 1
            }} viewport={{
              once: true
            }} transition={{
              type: 'spring',
              stiffness: 100
            }}>
                <svg className="w-10 h-10 text-amber-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
              <h2 className="font-display text-3xl font-bold mb-4">
                Join the UAE's Women Entrepreneurship Movement
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl">
                Be part of a connected network of founders, mentors, and
                partners shaping the UAE's global entrepreneurship story. Share
                your journey, learn from others, and contribute to the growing
                ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button onClick={onShareClick} className="px-6 py-3 bg-primary text-white font-body font-medium rounded-lg shadow-md hover:shadow-lg transition-all" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Share Your Story
                </motion.button>
                <motion.button onClick={onPartnerClick} className="px-6 py-3 border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary hover:text-white transition-colors" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                  Partner With Us
                </motion.button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-teal to-purple opacity-30"></div>
            {/* UAE skyline silhouette */}
            <div className="absolute -bottom-5 left-0 right-0 h-24 opacity-10 overflow-hidden">
              <svg viewBox="0 0 1440 120" fill="currentColor" className="text-gray-800 w-full h-full">
                <path d="M0,120 L0,90 L30,90 L30,80 L60,80 L60,70 L90,70 L90,80 L120,80 L120,60 L150,60 L150,50 L180,50 L180,70 L210,70 L210,80 L240,80 L240,60 L270,60 L270,40 L300,40 L300,50 L330,50 L330,40 L360,40 L360,20 L390,20 L390,40 L420,40 L420,30 L450,30 L450,20 L480,20 L480,10 L510,10 L510,0 L540,0 L540,10 L570,10 L570,20 L600,20 L600,30 L630,30 L630,40 L660,40 L660,30 L690,30 L690,20 L720,20 L720,10 L750,10 L750,20 L780,20 L780,10 L810,10 L810,30 L840,30 L840,50 L870,50 L870,60 L900,60 L900,70 L930,70 L930,80 L960,80 L960,70 L990,70 L990,50 L1020,50 L1020,40 L1050,40 L1050,50 L1080,50 L1080,60 L1110,60 L1110,40 L1140,40 L1140,30 L1170,30 L1170,40 L1200,40 L1200,50 L1230,50 L1230,60 L1260,60 L1260,50 L1290,50 L1290,40 L1320,40 L1320,30 L1350,30 L1350,20 L1380,20 L1380,10 L1410,10 L1410,20 L1440,20 L1440,120 Z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default JoinCommunity;