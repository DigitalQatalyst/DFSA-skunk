import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnersData } from '../../data/womenEntrepreneurs/partnersData';
import { XIcon, ExternalLinkIcon } from 'lucide-react';
const PartnerTicker: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [hoverPartner, setHoverPartner] = useState<number | null>(null);
  const handlePartnerClick = (id: number) => {
    setSelectedPartner(id);
  };
  const closeModal = () => {
    setSelectedPartner(null);
  };
  const selectedPartnerData = selectedPartner ? partnersData.find(partner => partner.id === selectedPartner) : null;
  return <section className="py-20 px-6 md:px-12 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Working together with leading UAE organizations to support women
            entrepreneurs.
          </p>
        </div>
        {/* Ticker */}
        <div className="relative overflow-hidden py-8 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-gray-50 before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-gray-50 after:to-transparent" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
          <motion.div className="flex space-x-16 whitespace-nowrap" animate={{
          x: isPaused ? 0 : '-100%'
        }} transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 25,
          ease: 'linear',
          repeatDelay: 0
        }}>
            {[...partnersData, ...partnersData].map((partner, index) => <motion.div key={`${partner.id}-${index}`} className="inline-flex flex-col items-center cursor-pointer group relative" onClick={() => handlePartnerClick(partner.id)} onMouseEnter={() => setHoverPartner(partner.id)} onMouseLeave={() => setHoverPartner(null)} whileHover={{
            y: -5
          }}>
                <motion.div className={`w-48 h-24 bg-white rounded-lg flex items-center justify-center p-4 mb-2 border transition-colors duration-300 ${hoverPartner === partner.id ? 'border-primary shadow-md' : 'border-gray-100'}`} whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain" />
                </motion.div>
                <p className={`text-sm font-medium transition-colors duration-300 ${hoverPartner === partner.id ? 'text-primary' : 'text-gray-700'}`}>
                  {partner.name}
                </p>
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {hoverPartner === partner.id && <motion.div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg p-3 z-20 w-48 text-center" initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} exit={{
                opacity: 0,
                y: 10
              }}>
                      <p className="text-xs text-gray-500">
                        {partner.headline}
                      </p>
                      <p className="text-xs text-primary mt-1 font-medium">
                        Click to learn more
                      </p>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>)}
          </motion.div>
        </div>
        {/* Partner modal */}
        <AnimatePresence>
          {selectedPartner && selectedPartnerData && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
              <motion.div initial={{
            opacity: 0,
            y: 50
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: 50
          }} transition={{
            type: 'spring',
            damping: 25
          }} className="bg-white rounded-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold">
                        {selectedPartnerData.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-body">
                        {selectedPartnerData.headline}
                      </p>
                    </div>
                    <motion.button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100" whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }}>
                      <XIcon size={20} />
                    </motion.button>
                  </div>
                  <div className="flex justify-center mb-6 bg-gray-50 p-4 rounded-lg">
                    <motion.img src={selectedPartnerData.logo} alt={selectedPartnerData.name} className="h-16 object-contain" whileHover={{
                  scale: 1.05
                }} />
                  </div>
                  <p className="text-gray-700 mb-6 font-body">
                    {selectedPartnerData.name} is a key partner in the UAE's
                    ecosystem supporting women entrepreneurs through funding,
                    mentorship, and networking opportunities. Their programs
                    have helped launch and scale numerous successful women-led
                    businesses across the Emirates.
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-display font-bold text-sm mb-2">
                      Partner Benefits
                    </h4>
                    <ul className="space-y-2">
                      {['Funding Opportunities', 'Mentorship Programs', 'Networking Events', 'Business Resources'].map((benefit, index) => <motion.li key={index} className="text-sm flex items-center text-gray-600 font-body" initial={{
                    opacity: 0,
                    x: -10
                  }} animate={{
                    opacity: 1,
                    x: 0
                  }} transition={{
                    delay: index * 0.1
                  }}>
                          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                          {benefit}
                        </motion.li>)}
                    </ul>
                  </div>
                  <div className="flex justify-end">
                    <motion.button className="bg-primary text-white px-6 py-2 rounded-lg font-medium flex items-center" whileHover={{
                  scale: 1.05,
                  backgroundColor: '#0020B0'
                }} whileTap={{
                  scale: 0.95
                }}>
                      Visit Partner
                      <ExternalLinkIcon size={16} className="ml-2" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </section>;
};
export default PartnerTicker;