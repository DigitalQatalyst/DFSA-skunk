import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, XIcon, ShareIcon, BookmarkIcon } from 'lucide-react';
import { storiesData, categories } from '../../data/womenEntrepreneurs/storiesData';
const InspirationFeed: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const filteredStories = activeCategory === 'All' ? storiesData : storiesData.filter(story => story.category === activeCategory);
  const openStoryModal = (id: number) => {
    setSelectedStory(id);
    document.body.style.overflow = 'hidden';
  };
  const closeStoryModal = () => {
    setSelectedStory(null);
    document.body.style.overflow = 'auto';
  };
  const selectedStoryData = selectedStory ? storiesData.find(story => story.id === selectedStory) : null;
  // Display only 5 categories initially, show all when expanded
  const displayedCategories = showAllCategories ? categories : categories.slice(0, 5);
  const toggleCategoriesDisplay = () => {
    setShowAllCategories(!showAllCategories);
    // Scroll to category section when expanding
    if (!showAllCategories && categoryRef.current) {
      setTimeout(() => {
        categoryRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };
  return <section className="py-20 px-6 md:px-12 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Inspiration <span className="text-primary">Feed</span>
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Stories and insights from women entrepreneurs who are transforming
            industries and communities in the UAE.
          </p>
          {/* Category filters */}
          <div ref={categoryRef} className="flex flex-wrap justify-center gap-2 mb-8">
            {displayedCategories.map(category => <motion.button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {category}
              </motion.button>)}
            {categories.length > 5 && <motion.button onClick={toggleCategoriesDisplay} className="px-4 py-2 rounded-full text-sm font-medium bg-white text-primary hover:bg-primary/10 transition-colors flex items-center" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {showAllCategories ? 'Show Less' : 'Show More'}
                <ChevronDownIcon size={16} className={`ml-1 transition-transform duration-300 ${showAllCategories ? 'rotate-180' : ''}`} />
              </motion.button>}
          </div>
        </div>
        {/* Stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => <motion.div key={story.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-cover bg-center" style={{
            backgroundImage: `url(${story.image})`
          }} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {story.category}
                  </span>
                  <motion.button whileHover={{
                scale: 1.1
              }} whileTap={{
                scale: 0.9
              }} className="text-gray-400 hover:text-primary transition-colors">
                    <BookmarkIcon size={18} />
                  </motion.button>
                </div>
                <h3 className="font-display text-xl font-bold mb-2 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {story.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 text-sm">By {story.author}</p>
                  <div className="flex gap-2">
                    <motion.button whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }} className="text-gray-400 hover:text-primary">
                      <ShareIcon size={16} />
                    </motion.button>
                    <motion.button onClick={() => openStoryModal(story.id)} className="text-primary font-medium text-sm hover:underline" whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }}>
                      Read Story
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>)}
        </div>
        {/* Story modal */}
        <AnimatePresence>
          {selectedStory && selectedStoryData && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={closeStoryModal}>
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
          }} className="bg-white rounded-xl max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="relative">
                  <div className="h-64 bg-cover bg-center" style={{
                backgroundImage: `url(${selectedStoryData.image})`
              }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-8 text-white">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
                          {selectedStoryData.category}
                        </span>
                        <h3 className="text-2xl font-display font-bold">
                          {selectedStoryData.title}
                        </h3>
                        <p className="text-white/80 mt-2 font-body">
                          By {selectedStoryData.author}
                        </p>
                      </div>
                    </div>
                  </div>
                  <motion.button onClick={closeStoryModal} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md" whileHover={{
                scale: 1.1,
                backgroundColor: '#f3f4f6'
              }} whileTap={{
                scale: 0.9
              }}>
                    <XIcon size={20} className="text-gray-600" />
                  </motion.button>
                </div>
                <div className="p-8">
                  <p className="text-lg text-gray-700 leading-relaxed font-body">
                    {selectedStoryData.content || selectedStoryData.excerpt}
                  </p>
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-500 font-body">
                        Share this story
                      </p>
                      <div className="flex space-x-3 mt-2">
                        {['twitter', 'facebook', 'linkedin'].map(platform => <motion.button key={platform} className="text-gray-400 hover:text-primary" whileHover={{
                      scale: 1.2
                    }} whileTap={{
                      scale: 0.9
                    }}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                              {platform === 'twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>}
                              {platform === 'facebook' && <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>}
                              {platform === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>}
                            </svg>
                          </motion.button>)}
                      </div>
                    </div>
                    <motion.button className="bg-primary text-white px-6 py-2 rounded-lg font-medium" whileHover={{
                  scale: 1.05,
                  backgroundColor: '#0020B0'
                }} whileTap={{
                  scale: 0.95
                }}>
                      Read More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </section>;
};
export default InspirationFeed;