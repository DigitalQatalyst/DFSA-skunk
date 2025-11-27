import React, { useState } from 'react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { resources, resourceTypes, getFeaturedResources } from '../data/dfsa';
import * as LucideIcons from 'lucide-react';
import { Download, ExternalLink, BookOpen, Search } from 'lucide-react';

/**
 * Resource Library Section
 * Guides, templates, regulatory updates, videos, and case studies
 */
const ResourceLibrarySection: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const featuredResources = getFeaturedResources();

  // Filter resources based on selected type and search query
  const displayResources = resources.filter((resource) => {
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <section className="w-full bg-white py-16 md:py-24 relative overflow-hidden" id="resources">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-dfsa-gold/5 to-transparent rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <FadeInUpOnScroll>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <BookOpen size={16} />
              <span>Knowledge Center</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Resource Library
            </h2>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access comprehensive guides, templates, regulatory updates, and educational resources to support your DFSA journey.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900 placeholder-gray-500"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Featured Resources */}
        {searchQuery === '' && selectedType === 'all' && (
          <FadeInUpOnScroll delay={0.2}>
            <div className="mb-16">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6 text-center">
                Featured Resources
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredResources.map((resource, index) => {
                  const IconComponent = LucideIcons[resource.icon as keyof typeof LucideIcons] as any;

                  return (
                    <div
                      key={resource.id}
                      className="bg-gradient-to-br from-primary/5 to-dfsa-gold/5 rounded-xl p-6 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                          {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                        </div>
                        <span className="px-2 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-gray-900 mb-2 line-clamp-2">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{resource.fileType}</span>
                        {resource.downloadable && (
                          <Download size={16} className="text-primary" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeInUpOnScroll>
        )}

        {/* Resource Type Tabs */}
        <FadeInUpOnScroll delay={0.3}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {resourceTypes.map((type) => {
              const IconComponent = LucideIcons[type.icon as keyof typeof LucideIcons] as any;

              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                    selectedType === type.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {IconComponent && <IconComponent size={16} />}
                  {type.label}
                </button>
              );
            })}
          </div>
        </FadeInUpOnScroll>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayResources.map((resource, index) => {
            const IconComponent = LucideIcons[resource.icon as keyof typeof LucideIcons] as any;

            return (
              <FadeInUpOnScroll key={resource.id} delay={0.05 * index}>
                <a
                  href={resource.url}
                  target={resource.downloadable ? '_blank' : '_self'}
                  rel={resource.downloadable ? 'noopener noreferrer' : undefined}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-primary/30 group h-full"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                    </div>
                    {resource.downloadable ? (
                      <Download size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                    ) : (
                      <ExternalLink size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-heading font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-primary">{resource.fileType}</span>
                      {resource.fileSize && <span>{resource.fileSize}</span>}
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                    {resource.publishedDate && (
                      <span>
                        {new Date(resource.publishedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  {resource.category && resource.category.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {resource.category.slice(0, 3).map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-dfsa-teal/10 text-dfsa-teal text-xs font-medium rounded"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              </FadeInUpOnScroll>
            );
          })}
        </div>

        {/* No Results */}
        {displayResources.length === 0 && (
          <FadeInUpOnScroll>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                No Resources Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </FadeInUpOnScroll>
        )}

        {/* Newsletter Signup CTA */}
        <FadeInUpOnScroll delay={0.6}>
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-br from-primary/5 to-dfsa-gold/5 rounded-2xl p-8 md:p-12 max-w-3xl mx-auto border border-primary/10">
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Stay Updated on DFSA Regulatory Changes
              </h3>
              <p className="text-gray-600 mb-6">
                Subscribe to receive the latest regulatory updates, guides, and resources directly in your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-900"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg
                             transition-all duration-300 hover:shadow-lg"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </FadeInUpOnScroll>

        {/* Resource Stats */}
        <FadeInUpOnScroll delay={0.8}>
          <div className="mt-12 text-center">
            <div className="inline-flex flex-wrap justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-primary mb-1">{resources.length}</div>
                <div className="text-sm text-gray-600">Total Resources</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-dfsa-gold mb-1">{featuredResources.length}</div>
                <div className="text-sm text-gray-600">Featured Guides</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-dfsa-teal mb-1">Weekly</div>
                <div className="text-sm text-gray-600">New Updates</div>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default ResourceLibrarySection;
