import React, { useEffect, useState, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { regionalHighlights } from '../services/womenEcosystemData'
const RegionalHighlights: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null)
  const [showLeftScroll, setShowLeftScroll] = useState<boolean>(false)
  const [showRightScroll, setShowRightScroll] = useState<boolean>(true)
  // Format data for the component
  const allRegions = regionalHighlights.map((region) => ({
    id: region.id,
    name: region.name,
    count: region.foundersCount,
    image: region.image,
    sector: region.sector,
    featuredFounder: region.featuredFounder,
  }))
  // Region summaries
  const regionSummaries: Record<string, string> = {
    'Abu Dhabi':
      'A thriving hub for women in technology, with strong government support and innovation programs.',
    Dubai:
      'Leading the region in fintech and digital entrepreneurship opportunities for women business leaders.',
    Sharjah:
      'Known for empowering women in creative industries through dedicated programs and resources.',
    Ajman:
      'Building a supportive ecosystem for women entrepreneurs in retail and consumer businesses.',
    'Umm Al Quwain':
      'Growing opportunities for women entrepreneurs in hospitality and tourism sectors.',
    'Ras Al Khaimah':
      'Supporting women-led tourism ventures with specialized programs and mentorship.',
    Fujairah:
      'Pioneering sustainable agriculture initiatives led by women entrepreneurs.',
  }
  // Handle scroll checking
  const checkScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftScroll(scrollLeft > 0)
    setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
  }
  // Initialize scroll check
  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])
  // Handle scroll button clicks
  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const scrollAmount =
      direction === 'left'
        ? -scrollContainerRef.current.clientWidth / 2
        : scrollContainerRef.current.clientWidth / 2
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
            Regional <span className="text-primary">Highlights</span>
          </h2>
          <p className="font-body text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore women entrepreneur communities across the seven emirates of
            the UAE.
          </p>
        </div>
        <div className="relative">
          {/* Scroll controls - more responsive positioning */}
          {showLeftScroll && (
            <motion.button
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 md:p-3 hover:bg-primary hover:text-white transition-colors"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeftIcon size={18} className="text-primary" />
            </motion.button>
          )}
          {showRightScroll && (
            <motion.button
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 md:p-3 hover:bg-primary hover:text-white transition-colors"
              onClick={() => handleScroll('right')}
            >
              <ChevronRightIcon size={18} className="text-primary" />
            </motion.button>
          )}
          {/* Left fade gradient */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-r from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showLeftScroll ? 'opacity-100' : 'opacity-0'}`}
          ></div>
          {/* Right fade gradient */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-16 z-[1] bg-gradient-to-l from-[rgba(249,250,252,0.9)] to-transparent pointer-events-none transition-opacity duration-300 ${showRightScroll ? 'opacity-100' : 'opacity-0'}`}
          ></div>
          {/* Scrollable container with improved responsiveness */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 md:pb-8 gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar"
            onScroll={() => checkScroll()}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allRegions.map((region, index) => (
              <motion.div
                key={region.id}
                className="flex-none w-[260px] sm:w-[280px] md:w-[320px] h-56 md:h-64 relative rounded-xl overflow-hidden shadow-md hover:shadow-lg cursor-pointer snap-start"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.3,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{
                  y: -5,
                  transition: {
                    duration: 0.2,
                  },
                }}
                onHoverStart={() => setHoveredRegion(index)}
                onHoverEnd={() => setHoveredRegion(null)}
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${region.image})`,
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                {/* Content container - always visible */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between text-white">
                  {/* Top content */}
                  <div className="flex justify-between items-start">
                    <h3 className="font-display text-xl md:text-2xl font-bold">
                      {region.name}
                    </h3>
                  </div>
                  {/* Bottom content */}
                   <div
                    className={`transition-opacity duration-200 ${
                      hoveredRegion === index ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <p className="text-white/80 text-sm mb-2">
                      {region.count} Featured Founders
                    </p>
                  </div>
                </div>
                {/* Hover overlay with description */}
                <AnimatePresence>
                  {hoveredRegion === index && (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="absolute inset-0 bg-primary/80 flex flex-col justify-between p-4 md:p-6 text-white"
                    >
                      <h3 className="font-display text-xl md:text-2xl font-bold mb-3 md:mb-4">
                        {region.name}
                      </h3>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-white/90 text-sm md:text-base">
                          {regionSummaries[region.name] ||
                            `Supporting women entrepreneurs in ${region.name}.`}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-3 md:mt-4">
                        <span className="text-white/90 text-xs md:text-sm">
                          {region.count} Featured Founders
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default RegionalHighlights
