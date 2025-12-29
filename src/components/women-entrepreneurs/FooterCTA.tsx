import React from 'react';
import { motion } from 'framer-motion';
import { footerData } from '../../data/womenEntrepreneurs/assistantData';
const FooterCTA: React.FC = () => {
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="container mx-auto">
        <motion.div className="text-center max-w-2xl mx-auto" initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        amount: 0.5
      }} transition={{
        duration: 0.7
      }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            {footerData.title}
          </h2>
          <p className="text-white/80 text-xl mb-10">{footerData.subtitle}</p>
          <motion.button className="px-8 py-4 bg-white text-primary font-body font-medium rounded-lg hover:bg-white/90 transition-colors shadow-md hover:shadow-lg" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            {footerData.buttonText}
          </motion.button>
        </motion.div>
      </div>
    </section>;
};
export default FooterCTA;