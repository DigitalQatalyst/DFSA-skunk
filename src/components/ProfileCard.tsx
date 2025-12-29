import React, { useState } from 'react';
import { PhoneIcon, MailIcon, GlobeIcon } from 'lucide-react';
interface ProfileCardProps {
  name: string;
  logo: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  onViewProfile: () => void;
  buttonText?: string;
}
const ProfileCard = ({
  name,
  logo,
  category,
  description,
  phone,
  email,
  website,
  onViewProfile,
  buttonText = 'View Profile'
}: ProfileCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fallbackLogo = '/mzn_logo.svg';

  const safeLogo = logo && !/^https?:\/\//i.test(logo) ? logo : fallbackLogo;
  return <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <div className="w-12 h-12 rounded-lg bg-gray-50 p-2 mr-3 shadow-sm flex items-center justify-center">
            {!imgLoaded && !imgError && (
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            )}
            <img
              src={imgError ? fallbackLogo : safeLogo}
              alt={`${name} logo`}
              className="w-full h-full object-contain"
              style={{ display: imgLoaded ? 'block' : 'none' }}
              referrerPolicy="no-referrer"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">{name}</h3>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {category}
            </p>
          </div>
        </div>
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {description}
          </p>
        </div>
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex items-center text-gray-600">
            <PhoneIcon size={16} className="mr-3 text-primary" />
            <a href={`tel:${phone}`} className="text-sm hover:text-primary transition-colors">
              {phone}
            </a>
          </div>
          <div className="flex items-center text-gray-600">
            <MailIcon size={16} className="mr-3 text-primary" />
            <a href={`mailto:${email}`} className="text-sm hover:text-primary transition-colors">
              {email}
            </a>
          </div>
          <div className="flex items-center text-gray-600">
            <GlobeIcon size={16} className="mr-3 text-primary" />
            <a href={`https://${website}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors">
              {website}
            </a>
          </div>
        </div>
        <div className="mt-auto border-t border-gray-100 pt-5">
          <button onClick={onViewProfile} className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
            {buttonText}
          </button>
        </div>
      </div>
    </div>;
};
export default ProfileCard;
