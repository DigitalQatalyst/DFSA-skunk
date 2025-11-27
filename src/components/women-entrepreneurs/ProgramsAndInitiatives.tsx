import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLinkIcon } from 'lucide-react';
interface Program {
  title: string;
  organization: string;
  region: string;
  description: string;
  link: string;
}
interface ProgramsAndInitiativesProps {
  programs: Program[];
}
const ProgramsAndInitiatives: React.FC<ProgramsAndInitiativesProps> = ({
  programs
}) => {
  return <section className="py-20 px-6 md:px-12 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Programs & <span className="text-primary">Initiatives</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Discover resources and support available for women entrepreneurs
            across the UAE.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => <motion.div key={program.title} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100" initial={{
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
              <div className="h-2 bg-primary" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold mb-1">
                      {program.title}
                    </h3>
                    <p className="text-primary font-medium text-sm">
                      {program.organization}
                    </p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {program.region}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{program.description}</p>
                <a href={program.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary font-medium hover:underline">
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
            Explore All Programs
          </motion.button>
        </div>
      </div>
    </section>;
};
export default ProgramsAndInitiatives;