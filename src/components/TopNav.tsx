import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const TopNav: React.FC = () => {
  return <nav className="bg-white shadow-md py-4 px-6 md:px-12">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-primary font-display text-2xl font-bold">
            Discover UAE
          </Link>
        </div>
        <div className="flex space-x-8 font-body text-gray-700">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/discover/women-entrepreneurs" className="text-primary font-medium">
            Discover
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            Programs
          </Link>
          <Link to="#" className="hover:text-primary transition-colors">
            Stories
          </Link>
        </div>
      </div>
    </nav>;
};
export default TopNav;