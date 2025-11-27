import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLinkIcon } from 'lucide-react';
interface Partner {
  title: string;
  description: string;
  logo: string;
  link: string;
}
interface EcosystemPartnersProps {
  partners: Partner[];
}
const EcosystemPartners: React.FC<EcosystemPartnersProps> = ({
  partners
}) => {
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ecosystem Partners <span className="text-primary">Empowering</span>{' '}
            Women Entrepreneurs
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the organizations dedicated to supporting women-led
            businesses across the UAE.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => <motion.div key={partner.title} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          amount: 0.3
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} whileHover={{
          y: -5
        }}>
              <div className="h-40 flex items-center justify-center p-6 border-b border-gray-100 bg-gray-50">
                <img src={partner.logo} alt={partner.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-bold mb-2">
                  {partner.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {partner.description}
                </p>
                <a href={partner.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-medium hover:underline text-sm">
                  Visit Website
                  <ExternalLinkIcon size={16} className="ml-1" />
                </a>
              </div>
            </motion.div>)}
        </div>
        <div className="text-center mt-12">
          <motion.button className="px-6 py-3 border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary hover:text-white transition-colors" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            View All Partners
          </motion.button>
        </div>
      </div>
    </section>;
};
export default EcosystemPartners;