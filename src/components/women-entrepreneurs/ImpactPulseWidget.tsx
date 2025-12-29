import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { impactData } from '../../data/womenEntrepreneurs/impactData';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, InfoIcon } from 'lucide-react';
const ImpactPulseWidget: React.FC = () => {
  return <section className="py-20 px-6 md:px-12 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Impact <span className="text-primary">Pulse</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time metrics showing the growth and impact of women
            entrepreneurs across the UAE.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactData.map((metric, index) => <MetricCard key={index} metric={metric} delay={index * 0.1} />)}
        </div>
      </div>
    </section>;
};
interface MetricCardProps {
  metric: {
    label: string;
    value: number;
    trend: number;
    description?: string;
  };
  delay: number;
}
const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  delay
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const trendColor = metric.trend > 0 ? 'text-green-600' : 'text-red-500';
  const trendBg = metric.trend > 0 ? 'bg-green-100' : 'bg-red-100';
  const barColor = metric.trend > 0 ? 'bg-primary' : 'bg-primary-light';
  // Format large numbers with commas
  const formattedValue = metric.value.toLocaleString();
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    delay,
    duration: 0.5
  }} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => {
    setIsHovered(false);
    setShowTooltip(false);
  }} whileHover={{
    y: -5
  }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-body font-medium text-gray-500">{metric.label}</h3>
        <div className="flex items-center">
          <div className={`flex items-center ${trendColor} text-sm font-medium px-2 py-1 rounded-full ${trendBg}`}>
            {metric.trend > 0 ? <ArrowUpIcon size={14} className="mr-1" /> : <ArrowDownIcon size={14} className="mr-1" />}
            <span>{Math.abs(metric.trend)}%</span>
          </div>
          {metric.description && <button className="ml-2 text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowTooltip(!showTooltip)} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
              <InfoIcon size={16} />
            </button>}
        </div>
      </div>
      {/* Tooltip */}
      {showTooltip && metric.description && <motion.div className="absolute z-10 p-3 bg-gray-800 text-white text-sm rounded shadow-lg max-w-xs -mt-2 right-0" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0,
      y: 10
    }}>
          {metric.description}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 -mt-1 right-4 -top-1"></div>
        </motion.div>}
      <div className="flex items-end mb-4">
        <motion.div className="text-4xl font-display font-bold text-primary" initial={{
        opacity: 1
      }} animate={{
        opacity: isHovered ? [1, 0.7, 1] : 1,
        scale: isHovered ? [1, 1.05, 1] : 1
      }} transition={{
        duration: 1,
        repeat: isHovered ? Infinity : 0
      }}>
          <motion.span initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1
        }}>
            {formattedValue}
          </motion.span>
        </motion.div>
        <TrendingUpIcon size={24} className={`ml-3 mb-1 ${metric.trend > 0 ? 'text-green-500' : 'text-red-400'}`} />
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <motion.div initial={{
        width: 0
      }} animate={{
        width: `${Math.min(100, metric.value / 200)}%`
      }} transition={{
        duration: 1,
        delay: delay + 0.3
      }} className={`h-full rounded-full ${barColor}`}></motion.div>
      </div>
      {/* Interactive pulse effect on hover */}
      {isHovered && <motion.div className="absolute inset-0 rounded-xl border-2 border-primary" initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: [0, 0.5, 0],
      scale: [0.8, 1.05, 1.1]
    }} transition={{
      duration: 1.5,
      repeat: Infinity
    }} />}
    </motion.div>;
};
export default ImpactPulseWidget;