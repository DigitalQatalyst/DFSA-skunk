import React, { useEffect, useState, useRef } from 'react'
import { ArrowRight, ExternalLink, ChevronRight } from 'lucide-react'
import { FadeInUpOnScroll } from './AnimationUtils'
import { featuredPrograms } from '../data/featuredPrograms'
interface Program {
  id: string
  title: string
  description: string
  ctaPrimary: {
    label: string
    link: string
  }
  ctaSecondary?: {
    label: string
    link: string
  }
  partner: string
  themeColor: string
  image: string
}
const FeaturedProgramSpotlight: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const programs = featuredPrograms.featured
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const hasMultiplePrograms = programs.length > 1
  // Handle auto-cycling between programs
  useEffect(() => {
    if (hasMultiplePrograms) {
      autoPlayRef.current = setInterval(() => {
        nextProgram()
      }, 7000) // Auto-cycle every 7 seconds
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [activeIndex, hasMultiplePrograms])
  const nextProgram = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % programs.length)
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }
  const prevProgram = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? programs.length - 1 : prevIndex - 1,
      )
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }
  const goToProgram = (index: number) => {
    if (isTransitioning || index === activeIndex) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIndex(index)
      setIsTransitioning(false)
    }, 500) // Match this with the CSS transition duration
  }
  // Get gradient based on theme color
  const getGradient = (themeColor: string) => {
    switch (themeColor) {
      case 'blue-purple':
        return 'from-blue-600/80 to-purple-600/80'
      case 'teal-gold':
        return 'from-teal-600/80 to-amber-500/80'
      case 'green-blue':
        return 'from-green-600/80 to-blue-500/80'
      default:
        return 'from-blue-600/80 to-indigo-600/80'
    }
  }
  const activeProgram = programs[activeIndex]
  const gradientClass = getGradient(activeProgram.themeColor)
  return (
    <section className="w-full bg-white py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Featured National Program
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Discover UAE-wide initiatives driving innovation, inclusion, and
            growth.
          </p>
        </FadeInUpOnScroll>
        {/* Program Card */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-lg transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          style={{
            minHeight: '360px',
          }}
        >
          {/* Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${activeProgram.image})`,
            }}
          ></div>
          <div
            className={`absolute inset-0 bg-gradient-to-r ${gradientClass} mix-blend-multiply`}
          ></div>
          {/* Content Container */}
          <div className="relative z-10 p-8 md:p-12 flex flex-col h-full min-h-[360px] justify-center">
            <div className="max-w-3xl">
              {/* Partner Tag */}
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm font-medium mb-4">
                In partnership with {activeProgram.partner}
              </div>
              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {activeProgram.title}
              </h3>
              {/* Description */}
              <p className="text-white/90 text-lg mb-8 max-w-2xl">
                {activeProgram.description}
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={activeProgram.ctaPrimary.link}
                  className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-lg shadow-md flex items-center transition-all duration-300 hover:-translate-y-1"
                >
                  {activeProgram.ctaPrimary.label}
                  <ChevronRight size={18} className="ml-2" />
                </a>
                {activeProgram.ctaSecondary && (
                  <a
                    href={activeProgram.ctaSecondary.link}
                    className="px-6 py-3 bg-transparent border border-white text-white hover:bg-white/10 font-bold rounded-lg flex items-center transition-all duration-300 hover:-translate-y-1"
                  >
                    {activeProgram.ctaSecondary.label}
                    <ExternalLink size={18} className="ml-2" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Indicators */}
        {hasMultiplePrograms && (
          <div className="flex justify-center mt-6 gap-2">
            {programs.map((program, index) => (
              <button
                key={program.id}
                onClick={() => goToProgram(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to program: ${program.title}`}
              />
            ))}
          </div>
        )}
      </div>
      {/* Add animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
export default FeaturedProgramSpotlight
