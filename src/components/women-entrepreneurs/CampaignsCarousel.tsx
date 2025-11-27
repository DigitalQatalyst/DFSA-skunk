import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { campaignsData } from '../../data/womenEntrepreneurs/campaignsData';
const CampaignsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = campaignsData.length;
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  // Format date string to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  // Auto-rotate slides
  useEffect(() => {
    if (!isPaused) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 5000);
    }
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [isPaused, totalSlides]);
  // Handlers
  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  };
  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  };
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  return <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-primary/5 to-teal/5">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Awareness <span className="text-primary">Campaigns</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Upcoming events and initiatives to support women entrepreneurs.
          </p>
        </div>
        <div className="relative h-[400px] md:h-[450px] rounded-xl overflow-hidden shadow-xl" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Slides */}
          <div className="h-full relative">
            {campaignsData.map((campaign, index) => <motion.div key={campaign.id} className="absolute inset-0 w-full h-full" initial={{
            opacity: 0
          }} animate={{
            opacity: currentSlide === index ? 1 : 0,
            zIndex: currentSlide === index ? 10 : 0
          }} transition={{
            duration: 0.7
          }}>
                <div className="h-full w-full bg-cover bg-center" style={{
              backgroundImage: `url(${campaign.image})`
            }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <div className="max-w-2xl">
                      {campaign.active && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                          Active Campaign
                        </span>}
                      <h3 className="text-white text-3xl md:text-4xl font-display font-bold mb-3">
                        {campaign.title}
                      </h3>
                      <p className="text-white/80 text-lg mb-6">
                        {campaign.tagline}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <p className="text-white/70 text-sm">
                            {formatDate(campaign.date)} • In partnership with{' '}
                            {campaign.partner}
                          </p>
                        </div>
                        <motion.button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors sm:w-auto w-full" whileHover={{
                      scale: 1.05
                    }} whileTap={{
                      scale: 0.95
                    }}>
                          Register Now
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>
          {/* Navigation arrows */}
          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-white/30 transition-colors" aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full z-20 hover:bg-white/30 transition-colors" aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          {/* Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {campaignsData.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2.5 h-2.5 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'}`} aria-label={`Go to slide ${index + 1}`}></button>)}
          </div>
        </div>
      </div>
    </section>;
};
export default CampaignsCarousel;