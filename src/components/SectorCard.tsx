import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface SectorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  growth: string;
  investment: string;
  color: string;
  detailsContent?: React.ReactNode;
  onDownloadReport?: (title: string) => void;
}

const SectorCard = ({
  title,
  description,
  icon,
  growth,
  investment,
  color,
  detailsContent,
  onDownloadReport
}: SectorCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="px-4 py-5 flex-grow flex flex-col">
          <div className="flex items-start mb-5">
            <div className="w-12 h-12 rounded-lg bg-gray-50 p-2 mr-3 shadow-sm flex items-center justify-center">
              <div className={`w-full h-full rounded-md flex items-center justify-center ${color} bg-opacity-10`}>
                {icon}
              </div>
            </div>
            <div className="flex-grow min-h-[72px] flex flex-col justify-center">
              <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">{title}</h3>
              <p className="text-sm text-gray-500 min-h-[20px] mt-1">
                {/* Category can be shown in parent if needed */}
              </p>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
              {description}
            </p>
          </div>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center text-gray-600 justify-between">
              <span className="text-sm">Annual Growth</span>
              <span className="text-sm font-semibold text-primary">{growth}</span>
            </div>
            <div className="flex items-center text-gray-600 justify-between">
              <span className="text-sm">Investment</span>
              <span className="text-sm font-semibold text-primary">{investment}</span>
            </div>
          </div>
          {detailsContent && (
            <div className="mt-auto border-t border-gray-100 pt-5">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Show More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-gray-50 p-3 shadow-sm flex items-center justify-center flex-shrink-0">
                <div className={`w-full h-full rounded-md flex items-center justify-center ${color} bg-opacity-10`}>
                  {icon}
                </div>
              </div>
              <div className="flex-grow">
                <DialogTitle className="text-2xl mb-2">{title}</DialogTitle>
                <DialogDescription className="text-base text-gray-600">
                  {description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Stats Section */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-gray-700 justify-between">
                <span className="text-base font-medium">Annual Growth</span>
                <span className="text-base font-semibold text-primary">{growth}</span>
              </div>
              <div className="flex items-center text-gray-700 justify-between">
                <span className="text-base font-medium">Investment</span>
                <span className="text-base font-semibold text-primary">{investment}</span>
              </div>
            </div>

            {/* Key Opportunities and Download Report */}
            {detailsContent && (
              <div className="border-t border-gray-200 pt-6">
                {detailsContent}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SectorCard;