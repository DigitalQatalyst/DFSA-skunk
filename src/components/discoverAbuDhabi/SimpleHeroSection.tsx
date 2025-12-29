import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BuildingIcon, GlobeIcon, TrendingUpIcon } from 'lucide-react';

const SimpleHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/80 via-indigo-500/40 to-blue-800/60 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
      />

      {/* Background image with overlay - Abu Dhabi */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512632578888-169bbbc64f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')"
        }}
      />

      {/* Abu Dhabi skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-10">
        <svg
          viewBox="0 0 1440 192"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,192 L0,144 L48,144 L48,128 L80,128 L80,112 L112,112 L112,128 L128,128 L128,96 L144,96 L144,80 L160,80 L160,112 L176,112 L176,128 L208,128 L208,96 L224,96 L224,64 L240,64 L240,80 L256,80 L256,64 L272,64 L272,32 L288,32 L288,64 L304,64 L304,48 L320,48 L320,32 L336,32 L336,16 L352,16 L352,0 L368,0 L368,16 L384,16 L384,32 L400,32 L400,48 L416,48 L416,64 L432,64 L432,48 L448,48 L448,32 L464,32 L464,16 L480,16 L480,32 L496,32 L496,16 L512,16 L512,48 L528,48 L528,80 L544,80 L544,96 L560,96 L560,112 L576,112 L576,128 L608,128 L608,112 L624,112 L624,80 L640,80 L640,64 L656,64 L656,80 L672,80 L672,96 L688,96 L688,64 L704,64 L704,48 L720,48 L720,64 L736,64 L736,80 L752,80 L752,96 L768,96 L768,80 L784,80 L784,64 L800,64 L800,48 L816,48 L816,32 L832,32 L832,16 L848,16 L848,32 L864,32 L864,48 L880,48 L880,64 L896,64 L896,80 L912,80 L912,96 L928,96 L928,112 L944,112 L944,128 L976,128 L976,112 L992,112 L992,96 L1008,96 L1008,112 L1024,112 L1024,128 L1056,128 L1056,112 L1072,112 L1072,96 L1088,96 L1088,80 L1104,80 L1104,64 L1120,64 L1120,80 L1136,80 L1136,96 L1152,96 L1152,112 L1168,112 L1168,128 L1184,128 L1184,144 L1216,144 L1216,128 L1232,128 L1232,112 L1248,112 L1248,96 L1264,96 L1264,80 L1280,80 L1280,64 L1296,64 L1296,80 L1312,80 L1312,96 L1328,96 L1328,112 L1344,112 L1344,128 L1360,128 L1360,144 L1376,144 L1376,160 L1408,160 L1408,144 L1424,144 L1424,160 L1440,160 L1440,192 Z"
            fill="rgba(0,0,0,0.2)"
          />
        </svg>
      </div>

      {/* Gold flowing gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-300/5 z-5"></div>

      {/* Animated decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full bg-blue-400/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      <motion.div
        className="absolute bottom-40 left-10 w-24 h-24 rounded-full bg-indigo-400/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 1
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-20 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover <span className="text-white">Abu Dhabi</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-white text-xl md:text-2xl mb-10 font-body leading-relaxed">
              A thriving global business hub at the crossroads of East and West,
              offering unparalleled opportunities for growth and innovation.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <BuildingIcon className="text-white mr-2" size={24} />
                <div className="text-3xl font-bold text-white">200+</div>
              </div>
              <div className="text-white text-sm">Global Companies</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUpIcon className="text-white mr-2" size={24} />
                <div className="text-3xl font-bold text-white">$400B</div>
              </div>
              <div className="text-white text-sm">GDP</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <GlobeIcon className="text-white mr-2" size={24} />
                <div className="text-3xl font-bold text-white">#1</div>
              </div>
              <div className="text-white text-sm">Ease of Business</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('abu-dhabi-map');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-white text-blue-600 font-body font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center justify-center">
                Explore Business Map
                <ArrowRightIcon className="ml-2" size={18} />
              </span>
            </motion.button>

            <motion.button
              onClick={() => {
                const element = document.getElementById('directory');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-body font-medium rounded-lg hover:bg-white hover:text-blue-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Business Directory
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHeroSection;
