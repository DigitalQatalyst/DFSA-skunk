import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Users, BookOpen, Settings, Calendar, UserCheck, MapPin, Clock, DollarSign } from 'lucide-react';
import { resourcesData, eventsData, mentorshipData } from '../../services/womenEcosystemData';

interface PlatformFeaturesModalProps {
  'data-id'?: string;
  isOpen: boolean;
  onClose: () => void;
}

const platformCategories = [
  { id: 'all', title: 'All Features', icon: BookOpen },
  { id: 'communities', title: 'Communities', icon: Users },
  { id: 'resources', title: 'Resources', icon: BookOpen },
  { id: 'services', title: 'Services', icon: Settings },
  { id: 'events', title: 'Events', icon: Calendar },
  { id: 'mentorship', title: 'Mentorship', icon: UserCheck }
];

const PlatformFeaturesModal: React.FC<PlatformFeaturesModalProps> = ({ 'data-id': dataId, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('all');
      setSearchQuery('');
    }
  }, [isOpen]);

  const getFilteredData = () => {
    let allData: any[] = [];

    if (activeTab === 'all') {
      allData = [
        ...resourcesData.map(item => ({ ...item, dataType: item.type.toLowerCase() })),
        ...eventsData.map(item => ({ ...item, dataType: 'events' })),
        ...mentorshipData.map(item => ({ ...item, dataType: 'mentorship' }))
      ];
    } else if (activeTab === 'communities') {
      allData = resourcesData.filter(r => r.type.toLowerCase() === 'communities').map(item => ({ ...item, dataType: 'communities' }));
    } else if (activeTab === 'resources') {
      allData = resourcesData.filter(r => r.type.toLowerCase() === 'resources').map(item => ({ ...item, dataType: 'resources' }));
    } else if (activeTab === 'services') {
      allData = resourcesData.filter(r => r.type.toLowerCase() === 'services').map(item => ({ ...item, dataType: 'services' }));
    } else if (activeTab === 'events') {
      allData = eventsData.map(item => ({ ...item, dataType: 'events' }));
    } else if (activeTab === 'mentorship') {
      allData = mentorshipData.map(item => ({ ...item, dataType: 'mentorship' }));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      allData = allData.filter(item => {
        const title = item.title || item.name || '';
        const description = item.description || '';
        const organization = item.organization || item.organizer || '';
        return title.toLowerCase().includes(query) || 
               description.toLowerCase().includes(query) ||
               organization.toLowerCase().includes(query);
      });
    }

    return allData;
  };

  const filteredData = getFilteredData();

  const renderCard = (item: any, index: number) => {
    const dataType = item.dataType;

    // Event card
    if (dataType === 'events') {
      return (
        <div key={`${item.id}-${index}`} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 text-primary">
              <Calendar size={18} />
              <span className="text-sm font-medium">{item.type}</span>
            </div>
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
              {item.price}
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={14} />
              <span>{item.date} • {item.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin size={14} />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users size={14} />
              <span>{item.capacity} participants</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">By {item.organizer}</span>
            <button 
              onClick={() => window.open(item.link, '_blank')}
              className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
            >
              Register <ExternalLink size={12} />
            </button>
          </div>
        </div>
      );
    }

    // Mentorship card
    if (dataType === 'mentorship') {
      return (
        <div key={`${item.id}-${index}`} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-800 truncate">{item.name}</h3>
              <p className="text-primary font-medium text-xs">{item.title}</p>
              <p className="text-gray-500 text-xs">{item.experience}</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.expertise.slice(0, 3).map((skill: string, idx: number) => (
              <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
          <div className="space-y-1 mb-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} />
              <span>{item.availability}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <a 
              href={item.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-primary-dark transition-colors text-xs flex items-center gap-1"
            >
              View Profile <ExternalLink size={12} />
            </a>
            <button className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-dark transition-colors">
              Request
            </button>
          </div>
        </div>
      );
    }

    // Resource/Community/Service cards
    return (
      <div key={`${item.id}-${index}`} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            {dataType === 'communities' && <Users className="text-primary" size={20} />}
            {dataType === 'resources' && <BookOpen className="text-primary" size={20} />}
            {dataType === 'services' && <Settings className="text-primary" size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 truncate">{item.title}</h3>
            <p className="text-xs text-gray-500 truncate">{item.organization}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{item.category}</span>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full capitalize">{dataType}</span>
        </div>
        <div className="flex justify-end pt-3 border-t border-gray-100">
          <button 
            onClick={() => window.open(item.link, '_blank')}
            className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
          >
            Learn More <ExternalLink size={12} />
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto" data-id={`${dataId}-modal`}>
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl relative z-10 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Platform Features</h3>
              <p className="text-sm text-gray-600 mt-1">Explore all communities, resources, services, events, and mentorship opportunities</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <input
              type="text"
              placeholder="Search features, organizations, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="px-6 py-4 border-b border-gray-200 overflow-x-auto flex-shrink-0">
            <div className="flex gap-2 min-w-max">
              {platformCategories.map((category) => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="font-medium text-sm">{category.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto flex-1">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-gray-400" size={32} />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h4>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> {filteredData.length === 1 ? 'result' : 'results'}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredData.map((item, index) => renderCard(item, index))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex-shrink-0">
            <p className="text-sm text-gray-600 text-center">
              Need help finding the right resource? <a href="#" className="text-primary font-medium hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PlatformFeaturesModal;
