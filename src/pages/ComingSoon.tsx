import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, MoonIcon, SunIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
export interface ComingSoonProps {
  headline?: string
  subText?: string
  ctaText?: string
  ctaLink?: string
  showTimer?: boolean
  targetDate?: Date
  animationVariant?: 'dots' | 'waves' | 'gradient'
}
export const ComingSoon: React.FC<ComingSoonProps> = ({
  headline = 'Coming Soon',
  subText = "We're building something exciting. Stay tuned.",
  ctaText = 'Go back to Home',
  ctaLink = '/',
  showTimer = true,
  targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  // 30 days from now
  animationVariant = 'dots',
}) => {
  const [darkMode, setDarkMode] = useState(false)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  function calculateTimeLeft() {
    const difference = +targetDate - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearTimeout(timer)
  })
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }
  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <SunIcon size={20} className="text-yellow-300" />
          ) : (
            <MoonIcon size={20} className="text-gray-600" />
          )}
        </button>
      </div>
      <div className="container mx-auto px-4 py-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent`}
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            {headline}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 opacity-80"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.3,
              duration: 0.8,
            }}
          >
            {subText}
          </motion.p>
          {showTimer && (
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-12"
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.5,
                duration: 0.8,
              }}
            >
              <TimeUnit
                value={timeLeft.days}
                label="Days"
                darkMode={darkMode}
              />
              <TimeUnit
                value={timeLeft.hours}
                label="Hours"
                darkMode={darkMode}
              />
              <TimeUnit
                value={timeLeft.minutes}
                label="Minutes"
                darkMode={darkMode}
              />
              <TimeUnit
                value={timeLeft.seconds}
                label="Seconds"
                darkMode={darkMode}
              />
            </motion.div>
          )}
          <motion.div
            className="mb-16"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
          >
            {animationVariant === 'dots' && (
              <DotAnimation darkMode={darkMode} />
            )}
            {animationVariant === 'waves' && (
              <WaveAnimation darkMode={darkMode} />
            )}
            {animationVariant === 'gradient' && (
              <GradientAnimation darkMode={darkMode} />
            )}
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.9,
              duration: 0.8,
            }}
          >
            <Link
              to={ctaLink}
              className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
              <ArrowLeftIcon size={18} className="mr-2" />
              {ctaText}
            </Link>
          </motion.div>
        </div>
      </div>
      <BackgroundEffect darkMode={darkMode} />
    </div>
  )
}
const TimeUnit: React.FC<{
  value: number
  label: string
  darkMode: boolean
}> = ({ value, label, darkMode }) => (
  <div
    className={`flex flex-col items-center p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
  >
    <span className="text-3xl font-bold">{value}</span>
    <span className="text-sm uppercase tracking-wide">{label}</span>
  </div>
)
const DotAnimation: React.FC<{
  darkMode: boolean
}> = ({ darkMode }) => (
  <div className="flex justify-center space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`w-4 h-4 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-500'}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: i * 0.3,
        }}
      />
    ))}
  </div>
)
const WaveAnimation: React.FC<{
  darkMode: boolean
}> = ({ darkMode }) => (
  <div className="flex justify-center items-end h-16 space-x-1">
    {[...Array(10)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-2 rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`}
        animate={{
          height: [10, 40, 10],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          delay: i * 0.1,
        }}
      />
    ))}
  </div>
)
const GradientAnimation: React.FC<{
  darkMode: boolean
}> = ({ darkMode }) => (
  <motion.div
    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
    animate={{
      rotate: 360,
      scale: [1, 1.1, 1],
    }}
    transition={{
      rotate: {
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      },
      scale: {
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    }}
  />
)
const BackgroundEffect: React.FC<{
  darkMode: boolean
}> = ({ darkMode }) => (
  <div className="fixed inset-0 z-0">
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${darkMode ? 'bg-gray-800 opacity-30' : 'bg-gray-200 opacity-50'}`}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  </div>
)
